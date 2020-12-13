resource "aws_security_group" "sg-rs-alb" {
    name        = "${var.env_prefix}-sg-rs-alb"
    description = "SG for the RunStats ALB"
    vpc_id      = aws_vpc.runstatsjs.id

    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = [ "0.0.0.0/0" ]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol    = -1
        cidr_blocks = [ "0.0.0.0/0" ]
    }

    tags = {
        AppName = var.env_prefix
    }
}


resource "aws_security_group" "sg-rs-webapp" {
    name        = "${var.env_prefix}-sg-rs-webapp"
    description = "security group for the Run Stats web tier"
    vpc_id      = aws_vpc.runstatsjs.id

    ingress {
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        security_groups = [ aws_security_group.sg-rs-alb.id ]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = -1
        cidr_blocks = [ "0.0.0.0/0" ]
    }

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_security_group" "sg-rs-dbdeployer" {
    name        = "${var.env_prefix}-sg-rs-dbdeployer"
    description = "security group for the Run Stats database deployer"
    vpc_id      = aws_vpc.runstatsjs.id

    egress {
        from_port = 0
        to_port = 0
        protocol = -1
        cidr_blocks = [ "0.0.0.0/0" ]
    }

    tags = {
        AppName = var.env_prefix
    }
}


resource "aws_security_group" "sg-rs-rds" {
    name        = "${var.env_prefix}-sg-rs-rds"
    description = "secuirty group for the RunStats database tier"
    vpc_id      = aws_vpc.runstatsjs.id

    ingress {
        from_port   = 5432
        to_port     = 5432
        protocol    = "tcp"
        security_groups = [ aws_security_group.sg-rs-webapp.id, aws_security_group.sg-rs-dbdeployer.id ]
    }

    tags = {
        AppName = var.env_prefix
    }
}