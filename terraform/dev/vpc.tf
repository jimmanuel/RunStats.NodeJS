resource "aws_vpc" "tfdev-runstats" {
    cidr_block = "10.0.0.0/16"

    tags = {
        Name = "tfdev-runstats"
    }
}