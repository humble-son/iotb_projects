variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
}

variable "sse_algorithm" {
    type = string
    default = "AES256"
}

variable "bucket_name" {
  description = "The name of the S3 bucket to create."
  type        = string
  default     = "biwjdhfjdladkfjgks-tfstate"
}

variable "logs_bucket_name" {
  description = "The name of the S3 bucket to create for logs."
  type        = string
  default     = "biwjdhfjdladkfjgks-tfstate-logs"
}