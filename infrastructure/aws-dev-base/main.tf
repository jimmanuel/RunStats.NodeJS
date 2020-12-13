provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    region         = "us-east-1"
    bucket         = "jlabar-runstats-cicd"
    key            = "tfstate/dev-base.tfstate"
    encrypt        = true
  }
}