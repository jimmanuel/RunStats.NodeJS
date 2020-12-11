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

data "archive_file" "proxy_zip" {
  type        = "zip"
  source_file = "../../src/proxy.js"
  output_path = "proxy-js.zip"
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

resource "aws_iam_role" "lambda_proxy_role" {
  name = "${var.env_prefix}-iam-for-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "test_lambda" {
  filename      = data.archive_file.proxy_zip.output_path
  function_name = "${var.env_prefix}-static-proxy"
  role          = aws_iam_role.lambda_proxy_role.arn
  handler       = "proxy.handler"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = filebase64sha256(data.archive_file.proxy_zip.output_path)

  runtime = "nodejs12.x"

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.s3_rs_static_web.bucket
    }
  }
}