resource "aws_internet_gateway" "igw-rs" {
    vpc_id = aws_vpc.runstatsjs.id

    tags = {
        AppName = var.env_prefix
    }
}