resource "aws_route53_record" "rs-alias" {
    zone_id = var.hosted_zone_id
    name = "rs.${var.env_prefix}"
    type = "A"

    alias {
        name = aws_lb.alb-rs.dns_name
        zone_id = aws_lb.alb-rs.zone_id
        evaluate_target_health = false
    }
}