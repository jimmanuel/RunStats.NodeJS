resource "aws_route_table" "tfdev-route-table" {
    vpc_id = aws_vpc.tfdev-runstats.id

    route {
        cidr_block = "10.0.0.0/0"
        gateway_id = aws_internet_gateway.tfdev-igw.id
    }
}

resource "aws_main_route_table_association" "tfdev-main-route-table" {
    vpc_id = aws_vpc.tfdev-runstats.id
    route_table_id = aws_route_table.tfdev-route-table.id
}