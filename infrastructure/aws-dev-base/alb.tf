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

resource "aws_lb_listener" "albl-rswebtier" {
    load_balancer_arn = aws_lb.alb-rs.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-TLS-1-2-2017-01"
    certificate_arn = data.aws_acm_certificate.acm_rs_cert.arn

    default_action {
        type = "fixed-response"

        fixed_response {
            content_type = "text/plain"
            message_body = ""
            status_code  = "404"
        }
    }
}
