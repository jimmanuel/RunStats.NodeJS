
resource "aws_ssm_parameter" "ssm-db-pwd" {
    name        = "/${var.env_prefix}/db-pwd"
    description = "database password"
    type        = "SecureString"
    value       = var.db_password

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_ssm_parameter" "ssm-db-username" {
    name        = "/${var.env_prefix}/db-username"
    description = "database user name"
    type        = "String"
    value       = var.db_username

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_ssm_parameter" "ssm-db-server" {
    name = "/${var.env_prefix}/db-server"
    description = "name of the relational database host for runstats"
    type = "String"
    value = aws_db_instance.rs-mysql.address

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_ssm_parameter" "ssm-db-name" {
    name = "/${var.env_prefix}/db-name"
    description = "name of the relational database name for runstats"
    type = "String"
    value = aws_db_instance.rs-mysql.name

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_ssm_parameter" "ssm-s3-name" {
    name = "/${var.env_prefix}/s3-name"
    description = "name of the S3 bucket for runstats"
    type = "String"
    value = aws_s3_bucket.s3-rs-data.bucket

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_ssm_parameter" "ssm-google-maps-key" {
    name = "/${var.env_prefix}/google-maps-key"
    description = "google maps api key"
    type = "String"
    value = var.google_maps_api_key

    tags = {
        AppName = var.env_prefix
    }
}