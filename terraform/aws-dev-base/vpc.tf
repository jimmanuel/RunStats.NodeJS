resource "aws_vpc" "runstatsjs" {
    cidr_block = "10.0.0.0/16"
    
    tags = {
        Name = "${var.env_prefix}-runstats"
        AppName = var.env_prefix
    }
}