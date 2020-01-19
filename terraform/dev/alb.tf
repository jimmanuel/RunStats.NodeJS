resource "aws_lb" "alb-rs-tfdev" {
    name = "alb-rs-tfdev"
    internal = false
    load_balancer_type = "application"

    security_groups = [ aws_security_group.sg-rs-tfdev-alb.id ]
    subnets = [ aws_subnet.rs-tfdev.id ]


  tags = {
    Environment = "development"
  }
}