output "tf_state_bucket_name" {
  description = "Name of the Terraform state bucket."
  value       = aws_s3_bucket.tf_state.bucket
}

output "tf_state_bucket_arn" {
  description = "ARN of the Terraform state bucket."
  value       = aws_s3_bucket.tf_state.arn
}

output "tf_state_logs_bucket_name" {
  description = "Name of the Terraform state access logs bucket."
  value       = aws_s3_bucket.tf_state_logs.bucket
}

output "tf_state_logs_bucket_arn" {
  description = "ARN of the Terraform state access logs bucket."
  value       = aws_s3_bucket.tf_state_logs.arn
}