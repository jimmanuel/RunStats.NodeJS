resource "aws_s3_bucket" "s3-rs-data" {
    bucket = var.s3_bucket_name
    acl = "private"

    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }
}

resource "aws_s3_bucket_public_access_block" "s3-rs-data-public-block" {
    bucket = aws_s3_bucket.s3-rs-data.id

    ignore_public_acls = true
    restrict_public_buckets = true
    block_public_acls   = true
    block_public_policy = true
}