resource "aws_default_route_table" "rs-route-table" {
    default_route_table_id = aws_vpc.runstatsjs.default_route_table_id

    route {
        cidr_block = "10.0.0.0/0"
        gateway_id = aws_internet_gateway.igw-rs.id
    }
}
