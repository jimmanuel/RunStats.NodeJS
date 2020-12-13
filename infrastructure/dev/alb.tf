resource "aws_lb" "alb-rs" {
    name = "${var.env_prefix}-alb-rs"
    internal = false
    load_balancer_type = "application"

    security_groups = [ aws_security_group.sg-rs-alb.id ]
    subnets = [ aws_subnet.rs-subnet.id, aws_subnet.rs-subnet-alt.id ]

    tags = {
        AppName = var.env_prefix
    }
}