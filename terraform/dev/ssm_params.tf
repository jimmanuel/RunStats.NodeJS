
resource "aws_ssm_parameter" "tfdev-db-pwd" {
    name        = "tfdev-db-pwd"
    description = "database password"
    type        = "SecureString"
    value       = var.db_password
}

resource "aws_ssm_parameter" "tfdev-db-username" {
    name        = "tfdev-db-username"
    description = "database user name"
    type        = "String"
    value       = var.db_username
}

resource "aws_ssm_parameter" "tfdev-db-server" {
    name = "tfdev-db-server"
    description = "name of the relational database for runstats"
    type = "String"
    value = aws_db_instance.tfdev-mysql.endpoint
}

resource "aws_ssm_parameter" "tfdev-s3-name" {
    name = "tfdev-s3-name"
    description = "name of the S3 bucket for runstats"
    type = "String"
    value = aws_s3_bucket.tfdev-rs-data.bucket
}

resource "aws_ssm_parameter" "tfdev-google-maps-key" {
    name = "tfdev-google-maps-key"
    description = "google maps api key"
    type = "String"
    value = var.google_maps_api_key
}