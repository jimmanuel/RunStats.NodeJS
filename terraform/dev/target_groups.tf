resource "aws_lb_target_group" "tfdev-tg-rswebapp" {
    name = "tg-tfdev-rswebapp"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.tfdev-runstats.id
    
}

resource "aws_lb_listener" "tfdev-albl-rswebtier" {
    load_balancer_arn = aws_lb.tfdev-alb-rs.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "TLS-1-2-Ext-2018-06"
    certificate_arn = "arn:aws:acm:us-east-1:747875535466:certificate/14b4b6da-9ac7-4c68-88f3-06026f04c124"

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.tfdev-tg-rswebapp.arn
    }
}

resource "aws_lb_listener_rule" "tfdev-albl-webtier-rule" {
    listener_arn = aws_lb_listener.tfdev-albl-rswebtier.arn
    priority = 99

    action {
        type = "forward"
        target_group_arn = aws_lb_target_group.tfdev-tg-rswebapp.arn
    }

    condition {
        path_pattern {
            values = [ "*" ]
        }
    }
}