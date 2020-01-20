#resource "aws_lb" "tfdev-alb-rs" {
#    name = "alb-rs-tfdev"
#    internal = false
#    load_balancer_type = "application"
#
#    security_groups = [ aws_security_group.tfdev-sg-rs-alb.id ]
#    subnets = [ aws_subnet.tfdev-rs-subnet.id ]
#
#
#    tags = {
#        Environment = "development"
#    }
#}