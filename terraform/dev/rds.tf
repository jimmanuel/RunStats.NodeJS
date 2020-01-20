resource "aws_db_subnet_group" "tfdev-rds-subnet-group" {
    name       = "tfdev-rds-subnet-group"
    subnet_ids = [ aws_subnet.tfdev-rs-subnet.id, aws_subnet.tfdev-rs-subnet-alt.id ]
}

resource "aws_db_instance" "tfdev-mysql" {
    allocated_storage    = 5
    storage_type         = "gp2"
    engine               = "mysql"
    engine_version       = "5.7"
    instance_class       = "db.t2.micro"
    name                 = "RunStats"
    username             = var.db_username
    password             = var.db_password
    parameter_group_name = "default.mysql5.7"
    db_subnet_group_name = aws_db_subnet_group.tfdev-rds-subnet-group.name
    vpc_security_group_ids = [ aws_security_group.tfdev-sg-rs-rds.id ]
}
