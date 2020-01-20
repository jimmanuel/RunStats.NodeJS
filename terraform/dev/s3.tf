resource "aws_s3_bucket" "tfdev-rs-data" {
    bucket = "tfdev-rs-data"
    acl = "private"

    server_side_encryption_configuration {
        rule {
            apply_server_side_encryption_by_default {
                sse_algorithm = "AES256"
            }
        }
    }
}

resource "aws_s3_bucket_public_access_block" "tfdev-rs-data-public-block" {
    bucket = "${aws_s3_bucket.tfdev-rs-data.id}"

    ignore_public_acls = true
    restrict_public_buckets = true
    block_public_acls   = true
    block_public_policy = true
}