# Jenkins Credentials Reference

The Jenkins pipeline (`Jenkinsfile`) relies on a few managed secrets and environment variables. Use this guide when rotating or re‑creating credentials so the pipeline can authenticate with Docker Hub and your deployment server.

## Required Credentials

| Purpose | Jenkins ID | Kind | Notes |
| --- | --- | --- | --- |
| Docker Hub login used in the “Push to Docker Hub” stage | `dockerhub-credentials` | Username with password | Username = Docker Hub account; Password = account password or access token with `write:packages` scope. Jenkins injects these into `DOCKER_USERNAME` / `DOCKER_PASSWORD` during the pipeline. |
| SSH access to the AWS deployment host | `aws-server-ssh` | SSH Username with private key | Username should match `AWS_DEPLOY_USER` (defaults to `ubuntu`). Paste the private key Jenkins should use. This credential is used inside the `sshagent` block to run remote docker compose commands. |

## Global Environment Variables

| Variable | Description |
| --- | --- |
| `AWS_SERVER_IP_GLOBAL` | Defined under “Manage Jenkins → System → Global properties”. The Jenkinsfile reads this to know which public IP to SSH into for deployments. Update it whenever the server IP changes. |

## Optional / Situational

| Purpose | Jenkins ID | When Needed |
| --- | --- | --- |
| Git checkout over HTTPS | e.g., `github-https-pat` | Only required if your Jenkins controller cannot access the GitHub repo anonymously. Create a “Username with password” credential where the password is a GitHub Personal Access Token with `repo` scope, then point the Pipeline’s SCM configuration at this credential. |

## Rotation Checklist

1. Update the credential in Jenkins (“Manage Jenkins → Credentials → System → Global credentials”) making sure the IDs above remain unchanged so the Jenkinsfile keeps working.
2. If you change the AWS SSH user, update both the credential’s username and the `AWS_DEPLOY_USER` environment block in the Jenkinsfile (or override via job parameters).
3. After rotation, run the pipeline manually to verify the new secrets are valid before relying on automated triggers.

Keep secrets out of the repo—only configure them through Jenkins’ credential store or global environment settings.
