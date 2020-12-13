resource "aws_db_subnet_group" "rds-subnet-group" {
    name       = "${var.env_prefix}-rds-subnet-group"
    subnet_ids = [ aws_subnet.rs-subnet.id, aws_subnet.rs-subnet-alt.id ]

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_db_instance" "rs-mysql" {
    allocated_storage    = 5
    storage_type         = "gp2"
    engine               = "postgres"
    engine_version       = "11.5"
    instance_class       = "db.t2.micro"
    name                 = "${var.env_prefix}_RunStats"
    username             = var.db_username
    password             = var.db_password
    db_subnet_group_name = aws_db_subnet_group.rds-subnet-group.name
    vpc_security_group_ids = [ aws_security_group.sg-rs-rds.id ]
    skip_final_snapshot = true

    tags = {
        AppName = var.env_prefix
    }
}
