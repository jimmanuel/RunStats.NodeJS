resource "aws_subnet" "rs-subnet" {
    vpc_id = aws_vpc.runstatsjs.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1b"
}

resource "aws_subnet" "rs-subnet-alt" {
    vpc_id = aws_vpc.runstatsjs.id
    cidr_block = "10.0.2.0/24"
    availability_zone = "us-east-1a"
}
