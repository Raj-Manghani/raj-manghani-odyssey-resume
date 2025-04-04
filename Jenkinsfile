// Jenkinsfile (Declarative Pipeline)

pipeline {
    agent none // Default agent - stages will specify their own

    // Tools directive is not needed when using specific docker agents for stages
    // tools {
    // js 'NodeJS-20'
    //     dockerTool 'DockerTool'
    // }

    environment {
        // Define environment variables for the pipeline
        // PATH modification no longer needed here
        REGISTRY_CREDENTIALS_ID = 'dockerhub-credentials' // Jenkins Credential ID for Docker Hub
        REGISTRY_URL            = 'docker.io/rajmanghani' // Your Docker Hub username/namespace
        FRONTEND_IMAGE_NAME     = 'raj-manghani-odyssey-frontend'
        BACKEND_IMAGE_NAME      = 'raj-manghani-odyssey-backend'
        AWS_SSH_CREDENTIALS_ID  = 'aws-server-ssh' // Jenkins Credential ID for AWS SSH Key
        AWS_SERVER_IP           = '54.189.185.118'
        AWS_DEPLOY_USER         = 'ubuntu' // Changed from bitnami
        AWS_APP_DIR             = '/home/ubuntu/app' // Assumed deployment directory on AWS
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10')) // Keep logs for last 10 builds
        disableConcurrentBuilds() // Prevent multiple builds running at once
    }

    stages {
        stage('Preparation') {
            agent any // Run preparation on default agent
            steps {
                checkout scm // Checkout code first to get env.GIT_COMMIT
                script {
                    echo "Starting pipeline for commit ${env.GIT_COMMIT}"
                    // Generate a unique tag (using first 7 chars of git commit)
                    // Ensure GIT_COMMIT exists before trying to use take()
                    def commitHash = env.GIT_COMMIT ?: 'unknown'
                    def imageTag = commitHash.take(7)
                    env.IMAGE_TAG = imageTag // Store tag in environment for later use
                    echo "Using Image Tag: ${env.IMAGE_TAG}"
                }
                stash includes: '**/*', name: 'source' // Stash source code for use in later stages/agents
            }
        }

        stage('Lint & Audit') {
            agent { docker { image 'node:20-alpine' } } // Use Node agent again
            steps {
                checkout scm // Checkout needed again in this agent's workspace
                echo "Running Lint & Audit..."
                echo "Running Lint & Audit..."
                // Install ALL dependencies (including devDeps like eslint) for the main project
                sh 'npm install'
                sh 'npm run lint'
                // Run audit but don't fail the build yet (append || true)
                sh 'npm audit || true'
                // Also audit backend deps, ignoring failure
                sh '(cd terminal-backend && npm install --omit=dev && npm audit || true)' // Run in subshell
            }
        }

        // --- Placeholder for Unit/Component Tests ---
        // stage('Unit Tests (Vitest)') {
        //     // This stage can run in the node:20-alpine agent
        //     steps {
        //         unstash 'source'
        //         echo "Running Unit/Component Tests..."
        //         sh 'npm install' // Need full devDeps for Vitest
        //         sh 'npm test' // Runs 'vitest run'
        //         // Also run backend tests
        //         sh 'cd terminal-backend && npm install && npm test && cd ..'
        //     }
        // }

        stage('Build Docker Images') {
            agent {
                // Use official Docker image, mount socket to use host's daemon
                docker {
                    image 'docker:latest'
                    // Add '-u root' to run commands inside agent as root
                    args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                checkout scm // Checkout needed again
                echo "Building Docker images with tag: ${env.IMAGE_TAG}"
                sh "docker build -f Dockerfile.frontend -t ${env.REGISTRY_URL}/${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG} ."
                sh "docker build -f Dockerfile.backend -t ${env.REGISTRY_URL}/${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            agent { // Use same Docker agent as build stage, also run as root
                docker {
                    image 'docker:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                checkout scm // Checkout needed again
                echo "Pushing images to Docker Hub: ${env.REGISTRY_URL}"
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    sh "docker push ${env.REGISTRY_URL}/${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                    sh "docker push ${env.REGISTRY_URL}/${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                    sh "docker logout"
                }
            }
        }

        stage('Deploy to AWS') {
            agent any // Use default agent (built-in node) which has SSH configured
            steps {
                echo "Deploying tag ${env.IMAGE_TAG} to AWS server ${env.AWS_SERVER_IP}"
                script {
                    // Use the AWS SSH credential ID configured in Jenkins
                    withCredentials([sshUserPrivateKey(credentialsId: env.AWS_SSH_CREDENTIALS_ID, keyFileVariable: 'AWS_SSH_KEY_PATH', usernameVariable: 'AWS_USERNAME')]) {
                        // Use sshagent wrapper for secure key handling
                        sshagent([env.AWS_SSH_CREDENTIALS_ID]) {
                            // Define remote host and base command
                            def sshHost = "${env.AWS_USERNAME}@${env.AWS_SERVER_IP}"
                            def sshOpts = "-o StrictHostKeyChecking=no"
                            def remoteCmd = "ssh ${sshOpts} ${sshHost}"

                            // Execute commands step-by-step
                            sh "${remoteCmd} \"echo 'Connected to AWS Server: ${env.AWS_SERVER_IP}'\""
                            sh "${remoteCmd} \"cd ${env.AWS_APP_DIR} || exit 1\"" // Fail if cd fails

                            // Define variables needed for compose commands
                            def frontendImg = "${env.REGISTRY_URL}/${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                            def backendImg = "${env.REGISTRY_URL}/${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                            def envPrefix = "FRONTEND_IMAGE_TAG=${env.IMAGE_TAG} BACKEND_IMAGE_TAG=${env.IMAGE_TAG} REGISTRY_URL=${env.REGISTRY_URL}"

                            // Pull new images using variables
                            sh "${remoteCmd} \"echo 'Pulling new images ${frontendImg} and ${backendImg}...' && cd ${env.AWS_APP_DIR} && ${envPrefix} docker compose pull\""

                            // Stop and remove ALL old containers defined in compose by name
                            sh "${remoteCmd} \"echo 'Stopping old containers...' && docker stop odyssey-frontend odyssey-backend nginx-proxy certbot || true\""
                            sh "${remoteCmd} \"echo 'Removing old containers...' && docker rm -f odyssey-frontend odyssey-backend nginx-proxy certbot || true\""

                            // Run docker compose down
                            sh "${remoteCmd} \"echo 'Running docker compose down...' && cd ${env.AWS_APP_DIR} && docker compose down --remove-orphans\""

                            // Start new containers using variables
                            sh "${remoteCmd} \"echo 'Starting new containers...' && cd ${env.AWS_APP_DIR} && ${envPrefix} docker compose up -d\""

                            sh "${remoteCmd} \"echo 'Deployment script finished.'\""
                        }
                    }
                }
            }
        }

        // --- Placeholder for E2E Tests ---
        // stage('E2E Tests (Playwright)') {
        //     // This stage needs a browser environment
        //     agent {
        //         docker {
        //             image 'mcr.microsoft.com/playwright:v1.51.1-jammy' // Official Playwright image
        //             // Mount workspace if needed, or unstash source
        //         }
        //     }
        //     steps {
        //         unstash 'source'
        //         echo "Running E2E Tests..."
        //         sh 'npm install' // Install all deps
        //         // Need to start the application first (maybe using docker compose up?)
        //         // Or run against a deployed staging environment
        //         // sh 'npm run test:e2e' // This needs the app running
        //         echo "E2E Test stage needs refinement based on test strategy"
        //     }
        // }
    }

    post {
        // Actions to run after pipeline completes
        always {
            // Use a node block with a label to get a workspace for cleanWs
            // 'built-in' is the typical label for the controller node
            node('built-in') {
                echo 'Pipeline finished.'
                cleanWs() // Clean up Jenkins workspace
            }
        }
        success {
            echo 'Pipeline succeeded!'
            // Add notifications (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notifications
        }
    }
}
