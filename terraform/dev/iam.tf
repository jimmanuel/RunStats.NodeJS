resource "aws_iam_role" "rs-iamrole-webapp" {
    name = "${var.env_prefix}-iamrole-webapp"
    path = "/"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
    EOF

    tags = {
        AppName = var.env_prefix
    }
}

resource "aws_iam_role_policy" "rs-policy-rsweb-s3access" {
    name = "${var.env_prefix}-policy-rsweb-s3access"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:Put*",
                "s3:Delete*"
            ],
            "Resource": "arn:aws:s3:::${var.s3_bucket_name}/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::*"
        }
    ]
}
    EOF
}


resource "aws_iam_role_policy" "rs-policy-rsweb-builddropaccess" {
    name = "${var.env_prefix}-policy-rsweb-builddropaccess"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::labar.jimbo.code/build/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::labar.jimbo.code/scripts/*"
        }
    ]
}
    EOF
}


resource "aws_iam_role_policy" "rs-policy-rsweb-ssmaccess" {
    name = "${var.env_prefix}-policy-rsweb-ssmaccess"
    role = aws_iam_role.rs-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [ "ssm:*" ],
            "Resource": "arn:aws:ssm:*:*:parameter/${var.env_prefix}/*"
        }
    ]
}
    EOF
}


resource "aws_iam_instance_profile" "rs-rswebapp-instance-profile" {
    name = "${var.env_prefix}-rswebapp-instance-profile"
    role = aws_iam_role.rs-iamrole-webapp.name
}