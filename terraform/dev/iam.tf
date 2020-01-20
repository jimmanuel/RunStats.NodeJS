resource "aws_iam_role" "tfdev-iamrole-webapp" {
    name = "tfdev-iamrole-webapp"
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
}

resource "aws_iam_role_policy" "tfdev-policy-rsweb-s3access" {
    name = "tfdev-policy-rsweb-s3access"
    role = aws_iam_role.tfdev-iamrole-webapp.id

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
            "Resource": "arn:aws:s3:::tfdev-rs-data/*"
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


resource "aws_iam_role_policy" "tfdev-policy-rsweb-builddropaccess" {
    name = "tfdev-policy-rsweb-builddropaccess"
    role = aws_iam_role.tfdev-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "arn:aws:s3:::labar.jimbo.code/build/*"
        }
    ]
}
    EOF
}


resource "aws_iam_role_policy" "tfdev-policy-rsweb-ssmaccess" {
    name = "tfdev-policy-rsweb-ssmaccess"
    role = aws_iam_role.tfdev-iamrole-webapp.id

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "ssm:*",
            "Resource": "arn:aws:ssm:*:*:*"
        }
    ]
}
    EOF
}


resource "aws_iam_instance_profile" "tfdev-rswebapp-instance-profile" {
    name = "tfdev-rswebapp-instance-profile"
    role = aws_iam_role.tfdev-iamrole-webapp.name
}