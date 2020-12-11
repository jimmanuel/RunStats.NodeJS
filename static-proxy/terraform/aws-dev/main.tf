provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    region  = "us-east-1"
    bucket  = "jlabar-runstats-cicd"
    key     = "tfstate/dev-static-proxy.tfstate"
    encrypt = true
  }
}


data "terraform_remote_state" "rs_base" {
  backend = "s3"
  config = {
    key    = "tfstate/dev-base.tfstate"
    region = "us-east-1"
    bucket = "jlabar-runstats-cicd"
  }
}

resource "aws_s3_bucket" "s3_rs_static_web" {
    bucket = "${var.env_prefix}-rs-static-web-content"
    acl = "private"                                                                                                                                                                                                                     
    force_destroy = true

    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_s3_bucket_public_access_block" "s3_rs_static_web_block" {
    bucket = aws_s3_bucket.s3_rs_static_web.id

    ignore_public_acls = true
    restrict_public_buckets = true
    block_public_acls   = true
    block_public_policy = true
}

resource "aws_s3_bucket_object" "s3_obj_health_check" {
  bucket = aws_s3_bucket.s3_rs_static_web.id

  key    = "health.html"
  acl    = "private"  # or can be "public-read"
  source = "../../src/health.html"
  etag = filemd5("../../src/health.html")
}