# Phase 2: Docker and Amazon ECR

This guide describes how to build and run the Next.js application in Docker,
then publish the image to Amazon Elastic Container Registry (ECR).

## Prerequisites

- Docker Desktop (or another Docker Engine) running locally.
- AWS CLI installed and configured with credentials for account
  `219063677017`.
- AWS permissions to create and push to ECR repositories.

The application is configured for Next.js standalone output. The Dockerfile
builds the application in one stage and copies the standalone server and static
assets into a runtime image. The container listens on port `3001`.

The `.dockerignore` file excludes dependencies, build output, Git metadata,
local environment files, and debug logs from the Docker build context.

## Build the image

Run these commands from the `phase2` directory:

```bash
docker build -t phase2:v1 .
```

Docker installs the dependencies using `npm ci`, builds the application using
`npm run build`, and creates the runtime image. Confirm that it was created:

```bash
docker images phase2
```

## Run the image locally

Publish container port `3001` on local port `3001`:

```bash
docker run -d --name phase2-local -p 3001:3001 phase2:v1
```

Open [http://localhost:3001](http://localhost:3001) to view the application.
Check the container status and logs with:

```bash
docker ps
docker logs phase2-local
```

Stop and remove the container when finished:

```bash
docker stop phase2-local
docker rm phase2-local
```

## Create the ECR repository

The repository used for this image is `murewa/phase2` in `us-east-1`. Create it
once with:

```bash
aws ecr create-repository \
  --repository-name murewa/phase2 \
  --region us-east-1
```

If the repository already exists, no need to create it again. Its image URI is:

```text
219063677017.dkr.ecr.us-east-1.amazonaws.com/murewa/phase2
```

## Authenticate Docker to ECR

Retrieve an ECR authorization token and pass it directly to Docker:

```bash
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    219063677017.dkr.ecr.us-east-1.amazonaws.com
```

The AWS identity used by the CLI must have permission to authenticate to ECR
and push images to the repository.

## Tag and push the image

Tag the locally built image with the ECR repository URI, then push it:

```bash
docker tag phase2:v1 \
  219063677017.dkr.ecr.us-east-1.amazonaws.com/murewa/phase2:latest

docker push \
  219063677017.dkr.ecr.us-east-1.amazonaws.com/murewa/phase2:latest
```

To publish another version, use a version tag (for example, `:v1`) instead of
`:latest` in both commands. Confirm that the image is in ECR with:

```bash
aws ecr describe-images \
  --repository-name murewa/phase2 \
  --region us-east-1
```

## Run the image pulled from ECR

On a machine authenticated to the same ECR registry, pull and run the image:

```bash
docker pull \
  219063677017.dkr.ecr.us-east-1.amazonaws.com/murewa/phase2:latest

docker run -d --name phase2-from-ecr -p 3001:3001 \
  219063677017.dkr.ecr.us-east-1.amazonaws.com/murewa/phase2:latest
```
