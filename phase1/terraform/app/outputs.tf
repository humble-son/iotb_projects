output "instance_id" {
  description = "ID of the web EC2 instance."
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IPv4 address of the web EC2 instance."
  value       = aws_instance.web.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the web EC2 instance."
  value       = aws_instance.web.public_dns
}

output "instance_type" {
  description = "Instance type of the web EC2 instance."
  value       = aws_instance.web.instance_type
}

output "vpc_id" {
  description = "ID of the VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet."
  value       = aws_subnet.public.id
}

output "web_security_group_id" {
  description = "ID of the web instance security group."
  value       = aws_security_group.web.id
}

output "key_pair_name" {
  description = "Name of the EC2 key pair used by the web instance."
  value       = aws_key_pair.key-pair.key_name
}