resource "aws_subnet" "rs-tfdev" {
    vpc_id = aws_vpc.RunStats-JS-tfdev.id
    cidr_block = "10.0.1.0/24"
}