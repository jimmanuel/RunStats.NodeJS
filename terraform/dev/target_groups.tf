resource "aws_lb_target_group" "tg-rswebapp" {
    name = "${var.env_prefix}-tg-rswebapp"
    port = 3000
    protocol = "HTTP"
    vpc_id = aws_vpc.runstatsjs.id
    deregistration_delay = 15

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

resource "aws_lb_listener" "albl-rswebtier" {
    load_balancer_arn = aws_lb.alb-rs.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-TLS-1-2-2017-01"
    certificate_arn = var.ssl_cert_arn

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.tg-rswebapp.arn
    }
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
            values = [ "*" ]
        }
    }
}