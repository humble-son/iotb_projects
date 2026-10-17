# Phase 1: AWS Infrastructure with Terraform

This project uses Terraform to provision the AWS infrastructure for a basic
web-server environment. It is organized into two independent root modules:

- `terraform/bootstrap` creates the S3 buckets used for Terraform state and
  state-bucket access logs.
- `terraform/app` creates a VPC and launches an Ubuntu EC2 instance in a public
  subnet.
- `ansible` configures the instance after it has been provisioned.

## Infrastructure

### Terraform state storage

The bootstrap configuration creates an S3 state bucket with versioning,
server-side encryption, public-access blocking, and a bucket policy that
requires HTTPS. It also creates a separate encrypted log bucket for S3 server
access logs. Both buckets have `prevent_destroy` enabled. The app's S3 backend
configuration expects the state bucket name and AWS region configured in
`terraform/app/backend.tf`.

### Application environment

The app configuration provisions:

- A VPC (`10.0.0.0/16`) with DNS support and hostnames enabled.
- A public subnet, internet gateway, and route table with internet access.
- An EC2 instance using the latest matching Ubuntu 22.04 AMI.
- A security group allowing inbound SSH (port 22) and HTTP (port 80), and
  outbound traffic.
- An EC2 key pair from a local public key file.

The instance requires IMDSv2 and uses an encrypted 20 GB `gp3` root volume.
Terraform provisions the instance and networking; Ansible handles the instance
configuration and web-server test.

### Ansible configuration

The `ansible` directory contains:

- `main.yml` — upgrades Ubuntu packages, optionally reboots when required,
  installs and enables Docker, and verifies Docker and an nginx test container.
- `inventory.ini` — defines the `webservers` host group and SSH connection
  settings. Replace the example host address with the EC2 public IP reported by
  Terraform's `instance_public_ip` output.

The playbook expects SSH access to the instance as `ubuntu`, and the controller
must be able to connect on port 22. It uses the `community.docker` collection.

## Prerequisites

- Terraform with the AWS provider (version `~> 6.0`).
- AWS credentials with permission to create the listed S3, VPC, and EC2
  resources.
- An SSH public key file. Set `public_key_path` in the app variables to its
  location.
- Ansible on the control machine, the matching SSH private key, and the
  `community.docker` collection.
- Globally unique S3 bucket names. Configure matching names for the bootstrap
  bucket and the S3 backend in `terraform/app/backend.tf`.

## Deploy

Run Terraform separately in each root module. Create the state bucket first,
because the app module uses it as its remote backend.

```powershell
cd terraform/bootstrap
terraform init
terraform plan
terraform apply

cd ../app
terraform init
terraform plan
terraform apply
```

After Terraform finishes, update `ansible/inventory.ini` with the app's
`instance_public_ip` output, then run the playbook from the `ansible` directory:

```powershell
ansible-galaxy collection install community.docker
ansible-playbook -i inventory.ini main.yml --private-key <path-to-ssh-private-key>
```

The playbook does not reboot the instance automatically. To allow a reboot when
package updates require one, add `-e allow_reboot=true` to the playbook command.

Set the required `aws_region` variable when prompted or provide it through a
Terraform variable file or environment variable. The app backend region and
bucket must match the bootstrap configuration.

To remove the app infrastructure, run `terraform destroy` from `terraform/app`.
The bootstrap buckets are protected from accidental deletion by
`prevent_destroy`; preserve them while any Terraform state still depends on
them.

## Outputs

The app module outputs the instance ID, public IP and DNS name, instance type,
VPC ID, public subnet ID, security group ID, and key pair name. The bootstrap
module outputs the state and logs bucket names and ARNs.

## Security note

SSH is currently allowed from `0.0.0.0/0`. Restrict this ingress rule to a
trusted IP range before using the environment beyond a temporary development
setup.