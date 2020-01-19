resource "aws_lb_target_group" "tg-tfdev-rswebapp" {
    name = "tg-tfdev-rswebapp"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.RunStats-JS-tfdev.id
    
}