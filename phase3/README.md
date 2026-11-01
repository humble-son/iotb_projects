# Phase 3 Deployment Guide

This project is deployed automatically through GitHub Actions using the workflow in [.github/workflows/main.yml](../.github/workflows/main.yml). The workflow is configured to build the app in `./phase3`, publish the Docker image to Amazon ECR, and then deploy it to an EC2 instance using AWS Systems Manager (SSM).

## Trigger

The workflow runs when:

- a push is made to the `main` branch
- the change affects either `phase3/**` or `.github/workflows/main.yml`
- the workflow is manually triggered via `workflow_dispatch`

## Required GitHub repository configuration

The workflow depends on the following GitHub repository variables and secrets:

- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `ECR_REPOSITORY`
- `EC2_INSTANCE_ID`
- `AWS_ROLE_ARN` (secret)

These values are used to authenticate to AWS, push the image to ECR, and run the deployment script remotely on EC2.

## Deployment flow

The deployment pipeline runs in the following order.

### 1. Checkout code

The workflow starts by checking out the repository source:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

### 2. Set up Node.js

It configures Node.js version 22 and enables npm caching for the `phase3` app dependencies:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: phase3/package-lock.json
```

This means the job uses the lock file in `phase3/package-lock.json` for reproducible installs.

### 3. Install dependencies

The workflow installs the app dependencies from the `phase3` folder:

```yaml
- name: Install dependencies
  run: npm ci
```

The job runs with:

```yaml
defaults:
  run:
    working-directory: ./phase3
```

so commands are executed in the app directory automatically.

### 4. Build the Next.js application

The app is built using the project’s standard build script:

```yaml
- name: Build application
  run: npm run build
```

This ensures the application compiles successfully before it is containerized or deployed.

### 5. Authenticate to AWS using OIDC

The workflow retrieves GitHub OIDC claims and then configures AWS credentials with an assumed IAM role:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v6
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: ${{ env.AWS_REGION }}
```

This replaces the need for static AWS keys and supports secure short-lived credentials.

### 6. Log in to Amazon ECR

The job logs into the AWS Elastic Container Registry:

```yaml
- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2
```

The registry URL is derived from the AWS account ID and region.

### 7. Set up Docker Buildx

Docker Buildx is enabled before building the image:

```yaml
- name: Setup Docker Buildx
  uses: docker/setup-buildx-action@v3
```

### 8. Build and push the Docker image

The app is built as a Docker image and pushed to ECR with a tag equal to the GitHub commit SHA:

```yaml
- name: Build and push image
  uses: docker/build-push-action@v6
  with:
    context: ./phase3
    push: true
    tags: |
      ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

This creates an image for the phase 3 app and stores it in the configured repository. The tag used is:

```text
${{ github.sha }}
```

### 9. Deploy to EC2 using AWS SSM

After the image is pushed, the workflow sends a remote shell script to the EC2 instance using AWS Systems Manager:

```yaml
- name: Deploy to EC2
  shell: bash
  run: |
    set -euo pipefail

    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    DEPLOY_SCRIPT=$(cat <<EOF
    set -euo pipefail

    aws ecr get-login-password --region ${AWS_REGION} | \
      docker login --username AWS --password-stdin ${ECR_REGISTRY}

    cd /opt/phase3

    export ECR_REGISTRY="${ECR_REGISTRY}"
    export ECR_REPOSITORY="${ECR_REPOSITORY}"
    export IMAGE_TAG="${IMAGE_TAG}"

    docker compose pull
    docker compose up -d --remove-orphans
    EOF
    )

    PARAMETERS=$(jq -cn --arg script "$DEPLOY_SCRIPT" \
      '{commands: [$script]}')

    COMMAND_ID=$(aws ssm send-command \
      --instance-ids "$EC2_INSTANCE_ID" \
      --document-name "AWS-RunShellScript" \
      --comment "Deploy NestJS application" \
      --parameters "$PARAMETERS" \
      --query "Command.CommandId" \
      --output text)
```

The important deployment commands executed on the EC2 instance are:

```bash
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <ECR_REGISTRY>
cd /opt/phase3
docker compose pull
docker compose up -d --remove-orphans
```

This pulls the newest image from ECR and restarts the application container with Docker Compose.

## Deployment verification

The workflow polls the SSM command status until it reaches a terminal state:

```yaml
for i in {1..60}; do
  STATUS=$(aws ssm get-command-invocation \
    --command-id "$COMMAND_ID" \
    --instance-id "$EC2_INSTANCE_ID" \
    --query "Status" \
    --output text 2>/dev/null || echo "Pending")

  case "$STATUS" in
    Success)
      echo "EC2 deployment completed successfully"
      exit 0
      ;;

    Failed|TimedOut|Cancelled)
      aws ssm get-command-invocation \
        --command-id "$COMMAND_ID" \
        --instance-id "$EC2_INSTANCE_ID" \
        --output json
      exit 1
      ;;
  esac

  sleep 5
done
```

If the command fails, the workflow prints the SSM invocation output and exits with an error.

## Summary

The deployment process is:

1. Push code to `main` in the `phase3` directory.
2. GitHub Actions checks out the repo and installs dependencies.
3. The app is built and validated.
4. AWS OIDC credentials are assumed.
5. Docker image is built and pushed to Amazon ECR.
6. EC2 receives an SSM deployment command.
7. Docker pulls the latest image and brings the app up in `/opt/phase3`.

This is the current CI/CD pipeline used to deploy the Phase 3 Next.js app into the environment managed by AWS.
