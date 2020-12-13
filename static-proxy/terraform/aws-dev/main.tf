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
  source_dir  = "../../src"
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

  key    = "index.html"
  acl    = "private"  # or can be "public-read"
  source = "../../src/index.html"
  etag = filemd5("../../src/index.html")
  content_type = "text/html"
  content_disposition = "inline"
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

resource "aws_lambda_function" "func_static_proxy" {
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

  tags = {
    AppName = var.env_prefix
  }
}

resource "aws_lb_target_group" "tg_rstatic_proxy" {
  name                 = "${var.env_prefix}-tg-static-proxy"
  port                 = 80
  protocol             = "HTTP"
  vpc_id               = data.terraform_remote_state.rs_base.outputs.vpc_id
  deregistration_delay = 15
  target_type          = "lambda"

  health_check {
    enabled             = true
    interval            = 300
    path                = "/health.html"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = "2"
    unhealthy_threshold = "2"
  }

  tags = {
    AppName = var.env_prefix
  }
}

resource "aws_lambda_permission" "with_lb" {
  statement_id  = "AllowExecutionFromlb"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.func_static_proxy.arn
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb_target_group.tg_rstatic_proxy.arn
}

resource "aws_lb_target_group_attachment" "tg_proxy_attachment" {
  target_group_arn = aws_lb_target_group.tg_rstatic_proxy.arn
  target_id        = aws_lambda_function.func_static_proxy.arn
  depends_on       = [aws_lambda_permission.with_lb]
}

resource "aws_lb_listener_rule" "albl_static_rule" {
  listener_arn = data.terraform_remote_state.rs_base.outputs.alb_listener_arn
  priority     = 999

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg_rstatic_proxy.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_iam_policy" "policy_proxy_to_s3" {
  name        = "${var.env_prefix}-static-web-s3-access"
  description = "A test policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:Get*"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.s3_rs_static_web.arn}/*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "proxy_cw_attachment" {
  role       = aws_iam_role.lambda_proxy_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "proxy_s3_attachment" {
  role       = aws_iam_role.lambda_proxy_role.name
  policy_arn = aws_iam_policy.policy_proxy_to_s3.arn
}