resource "aws_security_group" "tfdev-sg-rs-alb" {
    name        = "tfdev-sg-rs-alb"
    description = "SG for the RunStats ALB"
    vpc_id      = aws_vpc.tfdev-runstats.id

    ingress {
        # TLS (change to whatever ports you need)
        from_port   = 443
        to_port     = 80
        protocol    = "https"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
}


resource "aws_security_group" "tfdev-sg-rs-webapp" {
    name        = "tfdev-sg-rs-webapp"
    description = "security group for the Run Stats web tier"
    vpc_id      = aws_vpc.tfdev-runstats.id

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "http"
        security_groups = [ aws_security_group.tfdev-sg-rs-alb.id ]
    }

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "ssh"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
}


resource "aws_security_group" "tfdev-sg-rs-rds" {
    name        = "tfdev-sg-rs-rds"
    description = "secuirty group for the RunStats database tier"
    vpc_id      = aws_vpc.tfdev-runstats.id

    ingress {
        from_port   = 3306
        to_port     = 3306
        protocol    = "tcp"
        security_groups = [ aws_security_group.tfdev-sg-rs-webapp.id ]
    }
}