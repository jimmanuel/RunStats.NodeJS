provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    region         = "us-east-1"
    bucket         = "jlabar-runstats-cicd"
    key            = "tfstate/dev-server.tfstate"
    encrypt        = true
  }
}


data "terraform_remote_state" "rs_base" {
  backend = "s3"
  config = {
    key    = "tfstate/dev-base.tfstate"
    region = "us-gov-west-1"
    bucket = "jlabar-runstats-cicd"
  }
}

resource "aws_iam_role" "rs-iamrole-webapp" {
    name = "${var.env_prefix}-iamrole-webapp"
    path = "/"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [ 
            "ec2.amazonaws.com",
            "ecs-tasks.amazonaws.com"
            ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
    EOF

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_iam_role_policy" "rs-policy-rsweb-s3access" {
    name = "${var.env_prefix}-policy-rsweb-s3access"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:Put*",
                "s3:Delete*"
            ],
            "Resource": "arn:aws:s3:::"${var.env_prefix}-runstats-js-*/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::*"
        }
    ]
}
    EOF
}

resource "aws_iam_role_policy" "rs-policy-rsweb-ssmaccess" {
    name = "${var.env_prefix}-policy-rsweb-ssmaccess"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [ "ssm:*", "secretsmanager:*" ],
            "Resource": "arn:aws:ssm:*:*:parameter/${var.env_prefix}/*"
        }
    ]
}
    EOF
}

resource "aws_iam_role_policy" "rs-policy-rsweb-logsaccess" {
    name = "${var.env_prefix}-policy-rsweb-logsaccess"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
    EOF
}


resource "aws_iam_instance_profile" "rs-rswebapp-instance-profile" {
    name = "${var.env_prefix}-rswebapp-instance-profile"
    role = aws_iam_role.rs-iamrole-webapp.name
}

resource "aws_ecs_task_definition" "ecs-taskdef-rs" {
  family                = "runstatsjs-webapp"
  execution_role_arn = aws_iam_role.rs-iamrole-webapp.arn
  task_role_arn = aws_iam_role.rs-iamrole-webapp.arn
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  cpu = 256
  memory = 512
  container_definitions = <<EOF
[
    {
        "name": "rswebapp",
        "image": "747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:latest",
        "cpu": 256,
        "memory": 512,
        "essential": true,
        "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ],
        "environment": [
            { 
                "name": "ENV_PREFIX",
                "value": "${var.env_prefix}" 
            },
            {
                "name": "PERSISTENCE",
                "value": "IN_MEMORY"
            }
        ]
        ,"logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "${var.env_prefix}-rswebapp",
                "awslogs-region": "us-east-1",
                "awslogs-stream-prefix": "${var.env_prefix}-rswebapp",
                "awslogs-create-group" : "true"
            }
        }
    }
]
EOF

}

resource "aws_lb_target_group" "tg-rswebapp" {
    name = "${var.env_prefix}-tg-rswebapp"
    port = 3000
    protocol = "HTTP"
    vpc_id = data.terraform_remote_state.rs_base.outputs.id
    deregistration_delay = 15
    target_type = "ip"

    health_check {
        enabled = true
        interval = 15
        path = "/index.html"
        port = "traffic-port"
        protocol = "HTTP"
        healthy_threshold = "2"
        unhealthy_threshold = "2"
    }

    tags = {
        AppName = var.env_prefix
    }   
}

resource "aws_ecs_service" "ecs-rs" {
  name            = "${var.env_prefix}-ecs-service-rs"
  cluster         = data.terraform_remote_state.rs_base.outputs.ecs_cluster_id
  task_definition = aws_ecs_task_definition.ecs-taskdef-rs.arn
  desired_count   = 1
  depends_on      = [ aws_iam_role.rs-iamrole-webapp, aws_lb_listener_rule.albl-webtier-rule ]
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-rswebapp.arn
    container_name   = "rswebapp"
    container_port   = 3000
  }

  network_configuration {
      subnets = data.terraform_remote_state.rs_base.outputs.private_subnet_ids
      security_groups = [ data.terraform_remote_state.rs_base.outputs.server_sg_id ] 
      assign_public_ip = false
  }

}

resource "aws_lb_listener_rule" "albl-webtier-rule" {
    listener_arn = data.terraform_remote_state.rs_base.outputs.alb_listener_arn
    priority = 99

    action {
        type = "forward"
        target_group_arn = aws_lb_target_group.tg-rswebapp.arn
    }

    condition {
        path_pattern {
            values = [ "/api/*" ]
        }
    }
}