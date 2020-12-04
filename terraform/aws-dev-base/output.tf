output "sg_rs_server_sg_id" {
    value = aws_security_group.sg-rs-webapp.id
}

output "alb_listener_arn" {
    value = aws_lb_listener.albl-rswebtier.arn
}