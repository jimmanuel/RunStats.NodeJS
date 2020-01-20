resource "aws_route_table" "tfdev-route-table" {
    vpc_id = aws_vpc.tfdev-runstats.id

    route {
        cidr_block = "10.0.0.0/0"
        gateway_id = aws_internet_gateway.tfdev-igw.id
    }
}