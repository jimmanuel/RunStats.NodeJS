resource "aws_ecs_cluster" "ecs-cluster-rs" {
  name = "${var.env_prefix}-ecs-cluster-rs"
}