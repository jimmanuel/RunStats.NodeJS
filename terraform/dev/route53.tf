resource "aws_route53_record" "tfdev-rs-alias" {
    zone_id = "Z2POYYHQEJMPEV"
    name = "rs.dev"
    type = "A"

    alias {
        name = aws_lb.tfdev-alb-rs.dns_name
        zone_id = aws_lb.tfdev-alb-rs.zone_id
        evaluate_target_health = false
    }
}