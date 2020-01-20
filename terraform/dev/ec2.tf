resource "aws_instance" "i-tfdev-rswebapp" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.sg-rs-tfdev-webapp.id]
  iam_instance_profile = aws_iam_instance_profile.tfdev-rswebapp-instance-profile.name
}

resource "aws_lb_target_group_attachment" "att-tfdev-rsweb" {
  target_group_arn = aws_lb_target_group.tg-tfdev-rswebapp.arn
  target_id = aws_instance.i-tfdev-rswebapp.id
}