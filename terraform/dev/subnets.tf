resource "aws_subnet" "tfdev-rs-subnet" {
    vpc_id = aws_vpc.tfdev-runstats.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1b"
}

resource "aws_subnet" "tfdev-rs-subnet-alt" {
    vpc_id = aws_vpc.tfdev-runstats.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "us-east-1a"
}