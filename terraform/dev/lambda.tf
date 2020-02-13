resource "aws_lambda_function" "lam-rs-dbdeployer" {
  s3_bucket = "labar.jimbo.code"
  s3_key = "build/rs.db.zip"
  function_name = "${var.env_prefix}-rs-dbdeployer"
  role          = aws_iam_role.rs-iamrole-dbdeployer.arn
  handler       = "app/index.handler"
  memory_size = 128
  timeout = 15
  publish = "true"
  

  environment {

      variables = {
          DB_NAME: aws_db_instance.rs-mysql.name
          DB_HOST: aws_db_instance.rs-mysql.address
          DB_USERNAME: var.db_username
          DB_PASSWORD: var.db_password
      }
  }

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  #source_code_hash = "${base64sha256(file("https:////s3.amazonaws.com/labar.jimbo.code/build/rs.db.zip"))}"

  runtime = "nodejs12.x"

  vpc_config {
      subnet_ids = [ aws_subnet.rs-subnet.id, aws_subnet.rs-subnet-alt.id ]
      security_group_ids = [ aws_security_group.sg-rs-dbdeployer.id ]
  }
}