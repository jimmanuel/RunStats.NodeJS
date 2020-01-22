resource "aws_instance" "i-rswebapp" {
    ami           = "ami-09d069a04349dc3cb"
    instance_type = "t2.micro"
    subnet_id = aws_subnet.rs-subnet.id
    vpc_security_group_ids = [aws_security_group.sg-rs-webapp.id]
    iam_instance_profile = aws_iam_instance_profile.rs-rswebapp-instance-profile.name
    key_name = "${var.env_prefix}-webapp"
    associate_public_ip_address = true
}

resource "aws_lb_target_group_attachment" "att-rsweb" {
    target_group_arn = aws_lb_target_group.tg-rswebapp.arn
    target_id = aws_instance.i-rswebapp.id
}