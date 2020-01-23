data "aws_route53_zone" "rs-zone" {
  name         = "jlabar.us."
  private_zone = false
}

resource "aws_route53_record" "rs-alias" {
    zone_id = data.aws_route53_zone.rs-zone.zone_id
    name = var.app_url
    type = "A"

    alias {
        name = aws_lb.alb-rs.dns_name
        zone_id = aws_lb.alb-rs.zone_id
        evaluate_target_health = false
    }
}