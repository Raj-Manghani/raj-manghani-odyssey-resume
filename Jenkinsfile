// Jenkinsfile (Declarative Pipeline)

pipeline {
    // Agent Configuration: Use Docker for build steps
    // Assumes Jenkins controller has Docker installed & socket mounted,
    // OR uses a Docker cloud agent configuration.
    agent {
        docker {
            image 'node:20-alpine' // Use a Node image for npm steps
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount docker socket if needed
            // Add '-u root' if necessary for permissions, or configure docker group access
        }
    }

    environment {
        // Define environment variables for the pipeline
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
            steps {
                script {
                    echo "Starting pipeline for commit ${env.GIT_COMMIT}"
                    // Generate a unique tag (using first 7 chars of git commit)
                    def imageTag = env.GIT_COMMIT.take(7)
                    env.IMAGE_TAG = imageTag // Store tag in environment for later use
                    echo "Using Image Tag: ${env.IMAGE_TAG}"
                }
                checkout scm // Checks out code from the Git repo Jenkins is linked to
                stash includes: '**/*', name: 'source' // Stash source code for use in later stages/agents
            }
        }

        stage('Lint & Audit') {
            // This stage can run in the node:20-alpine agent
            steps {
                unstash 'source'
                echo "Running Lint & Audit..."
                sh 'npm install --omit=dev' // Install deps needed for lint/audit
                sh 'npm run lint'
                // Consider failing build on audit warnings: npm audit --audit-level=high
                sh 'npm audit'
                // Also audit backend deps
                sh 'cd terminal-backend && npm install --omit=dev && npm audit && cd ..'
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
            // This stage requires Docker access
            agent any // Use default agent which should have docker socket mounted or be docker itself
            steps {
                unstash 'source'
                echo "Building Docker images with tag: ${env.IMAGE_TAG}"
                sh "docker build -f Dockerfile.frontend -t ${env.REGISTRY_URL}/${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG} ."
                sh "docker build -f Dockerfile.backend -t ${env.REGISTRY_URL}/${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            // This stage requires Docker access and credentials
            agent any
            steps {
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
            // This stage requires SSH access
            agent any // Run on controller or agent capable of SSH
            steps {
                echo "Deploying tag ${env.IMAGE_TAG} to AWS server ${env.AWS_SERVER_IP}"
                script {
                    // Use the AWS SSH credential ID configured in Jenkins
                    withCredentials([sshUserPrivateKey(credentialsId: env.AWS_SSH_CREDENTIALS_ID, keyFileVariable: 'AWS_SSH_KEY_PATH', usernameVariable: 'AWS_USERNAME')]) {
                        // Use sshagent wrapper for secure key handling
                        sshagent([env.AWS_SSH_CREDENTIALS_ID]) {
                            // Define the deployment script to run remotely
                            def remoteScript = """
                                echo 'Connected to AWS Server: ${env.AWS_SERVER_IP}'
                                cd ${env.AWS_APP_DIR} || { echo 'Failed to cd to app dir'; exit 1; }

                                # Set environment variables for docker compose from Jenkins env
                                # Ensure your docker-compose.yml uses these variables e.g. \${FRONTEND_IMAGE_TAG}
                                export FRONTEND_IMAGE_TAG=${env.IMAGE_TAG}
                                export BACKEND_IMAGE_TAG=${env.IMAGE_TAG}
                                export REGISTRY_URL=${env.REGISTRY_URL} # Pass registry URL/user if needed

                                echo "Using Frontend Image: ${env.REGISTRY_URL}/${env.FRONTEND_IMAGE_NAME}:${env.FRONTEND_IMAGE_TAG}"
                                echo "Using Backend Image: ${env.REGISTRY_URL}/${env.BACKEND_IMAGE_NAME}:${env.BACKEND_IMAGE_TAG}"

                                echo 'Pulling new images...'
                                # Login to registry on remote host if images are private
                                # Consider storing docker hub creds securely on AWS server or passing via SSH
                                # docker login -u ... -p ... ${env.REGISTRY_URL}
                                docker compose pull # Assumes compose file specifies the correct image names

                                echo 'Stopping and removing old containers...'
                                docker compose down

                                echo 'Starting new containers...'
                                docker compose up -d # Starts containers using pulled images & env vars

                                # Optional: Prune old images/volumes
                                # docker image prune -af
                                # docker volume prune -af

                                echo 'Deployment script finished.'
                            """
                            // Execute the script remotely via SSH
                            sh "ssh -o StrictHostKeyChecking=no ${env.AWS_USERNAME}@${env.AWS_SERVER_IP} '${remoteScript}'"
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
            echo 'Pipeline finished.'
            cleanWs() // Clean up Jenkins workspace
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
