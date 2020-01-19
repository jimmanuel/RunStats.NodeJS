resource "aws_vpc" "RunStats-JS-tfdev" {
    cidr_block = "10.0.0.0/16"

    tags = {
        Name = "RunStats.JS.tfdev"
    }
}