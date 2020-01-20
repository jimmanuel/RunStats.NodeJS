resource "aws_instance" "tfdev-i-rswebapp" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.tfdev-sg-rs-webapp.id]
  iam_instance_profile = aws_iam_instance_profile.tfdev-rswebapp-instance-profile.name
  key_name = "RunStatsWebTier.pem"
}

resource "aws_lb_target_group_attachment" "tfdev-att-rsweb" {
  target_group_arn = aws_lb_target_group.tfdev-tg-rswebapp.arn
  target_id = aws_instance.tfdev-i-rswebapp.id
}