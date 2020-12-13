data "aws_acm_certificate" "acm_rs_cert" {
  domain      = "${var.app_url}.jlabar.us"
  types       = ["AMAZON_ISSUED"]
  statuses    = ["ISSUED"]
  most_recent = true
}