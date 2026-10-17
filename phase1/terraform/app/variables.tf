variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
}

variable "project_name" {
  type = string
  default = "iotbProject"
}

variable "public_subnet_cidr" {
  type = string
  default = "10.0.1.0/24"
}

variable "tags" {
  description = "Additional tags applied to all resources."
  type        = map(string)
  default = {
    ManagedBy = "terraform"
    Project   = "phase1"
  }
}

variable "environment" {
  type = string
  default = "development"
}

variable "public_key_path" {
  description = "Path to the PUBLIC key on my laptop (the .pub file)"
  type        = string
  default     = "C:\\Users\\Abass.Ibrahim\\.ssh\\id_rsa.pub"
}

variable "instance_type" {
  description = "The type of EC2 instance to launch."
  type        = string
  default     = "t3.micro"
}