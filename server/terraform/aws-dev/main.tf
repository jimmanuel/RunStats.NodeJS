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
                "name": "AWS_ENV",
                "value": "${var.env_prefix}" 
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

resource "aws_lb_listener_rule" "albl-webtier-rule" {
    listener_arn = aws_lb_listener.albl-rswebtier.arn
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