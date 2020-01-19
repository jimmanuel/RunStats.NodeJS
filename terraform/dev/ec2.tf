resource "aws_instance" "i-tfdev-rswebapp" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}

resource "aws_lb_target_group_attachment" "att-tfdev-rsweb" {
  target_group_arn = aws_lb_target_group.tg-tfdev-rswebapp.arn
  target_id = aws_instance.i-tfdev-rswebapp.id
}