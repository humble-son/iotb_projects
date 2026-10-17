terraform {
  backend "s3" {
    bucket       = "biwjdhfjdladkfjgks-tfstate"
    key          = "phase1/terraform.tfstate"   # the path of THIS project's state inside the bucket
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true                      # prevents two people running apply at once
  }
}