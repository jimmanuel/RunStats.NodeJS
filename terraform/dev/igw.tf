resource "aws_internet_gateway" "tfdev-igw" {
    vpc_id = aws_vpc.tfdev-runstats.id
}