resource "aws_ecs_cluster" "ecs-cluster-rs" {
  name = "${var.env_prefix}-ecs-cluster-rs"
}

resource "aws_ecs_task_definition" "ecs-taskdef-rs" {
  family                = "runstatsjs-webapp"
  execution_role_arn = aws_iam_role.rs-iamrole-webapp.arn
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
    }
]
EOF

#   volume {
#     name      = "service-storage"
#     host_path = "/ecs/service-storage"
#   }

#   placement_constraints {
#     type       = "memberOf"
#     expression = "attribute:ecs.availability-zone in [us-west-2a, us-west-2b]"
#   }
}


resource "aws_ecs_service" "ecs-rs" {
  name            = "${var.env_prefix}-ecs-service-rs"
  cluster         = aws_ecs_cluster.ecs-cluster-rs.id
  task_definition = aws_ecs_task_definition.ecs-taskdef-rs.arn
  desired_count   = 1
  #iam_role        = aws_iam_role.rs-iamrole-webapp.arn
  depends_on      = [ aws_iam_role.rs-iamrole-webapp ]
  launch_type     = "FARGATE"

#   ordered_placement_strategy {
#     type  = "binpack"
#     field = "cpu"
#   }

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-rswebapp.arn
    container_name   = "rswebapp"
    container_port   = 3000
  }

  network_configuration {
      subnets = [ aws_subnet.rs-subnet.id, aws_subnet.rs-subnet-alt.id ]
      security_groups = [ aws_security_group.sg-rs-webapp.id ] 
      assign_public_ip = true
  }

#   placement_constraints {
#     type       = "memberOf"
#     expression = "attribute:ecs.availability-zone in [us-west-2a, us-west-2b]"
#   }
}
