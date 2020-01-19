resource "aws_security_group" "sg-rs-tfdev-alb" {
    name        = "sg-rs-tfdev-alb"
    description = "SG for the RunStats ALB"
    vpc_id      = aws_vpc.RunStats-JS-tfdev.id

    ingress {
        # TLS (change to whatever ports you need)
        from_port   = 443
        to_port     = 80
        protocol    = "https"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
}


resource "aws_security_group" "sg-rs-tfdev-webapp" {
    name        = "sg-rs-tfdev-webapp"
    description = "security group for the Run Stats web tier"
    vpc_id      = aws_vpc.RunStats-JS-tfdev.id

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "http"
        security_groups = [ aws_security_group.sg-rs-tfdev-alb.id ]
    }

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "ssh"
        cidr_blocks = [ "0.0.0.0/0" ]
    }
}


resource "aws_security_group" "sg-rs-tfdev-rds" {
    name        = "sg-rs-tfdev-rds"
    description = "secuirty group for the RunStats database tier"
    vpc_id      = aws_vpc.RunStats-JS-tfdev.id

    ingress {
        from_port   = 3306
        to_port     = 3306
        protocol    = "tcp"
        security_groups = [ aws_security_group.sg-rs-tfdev-webapp.id ]
    }
}