# RunStats.NodeJS
Welcome to the Node JS flavor of RunStats.

This project serves multiple purposes:
- Replicate functionality from a popular Keeper of Running Data web site that now requires a paid subscription to use
- Let me learn about building web apps using the NodeJS/Angular/React tech stack
- Let me learn how to deploy and run an app on AWS using Infrastructure-as-Code
- Let me learn how to integrate a third party IdP.

My target is to build a web application that parses and performs data analysis on my running activities.  I use the Run Keeper application record those activities and then export them to GPX format; that makes the data easy to ingest and do whatever I want with it.  The targetted tech stack is NodeJS and Angular/React (I haven't decided) for the application code and a SQL Server / S3 bucket for data storage.  

A few more things of note:
- this project is for my benefit; feel free to pull/fork/clone/do whatever you want with it but it comes with no warranty and no support
- I've been able to dedicate short periods of time to the project recently but not large chucks and also not consistently.  Don't expect regular updates.
- the original version of this app was as an Android application
- I'm comfortable with SQL and Node JS but not Angular or React.  Expect a high wtf/sloc ratio in those areas.

# Tech Notes
- I built an adapter layer so that I can easily switch between storing data in AWS native services or storing all data in memory in order to run it locally.  This should also allow me to build a layer to learn Azure or Google cloud storage later.
- I started integrating a proper DI library (inversify) but it became a bit of over-enginnering for what I needed.  I reverted to the pinciples of KISS and YAGNI.  If and when the home rolled Inversion of Control implementation becomes too much to maintain, I'l revisit that decision.
- Test coverage is horrible.
- Google is my IdP.  This portion of the app needs to be configured outside the terraform scripts.
- My AWS Architecture does not follow all security best practices.  It's set up right now to facilitate application development and debugging.
- Similarly, my terraform structure doesn't follow the most reusable pattern.  It was setup by a TF noob (me) to facilitate easy setup and teardown of my infrastructure so that I don't get billed for any persistenly running services (I'm looking at you, ALB and RDS).
- I've decided that I rather dislike React and I want to re-write the frontend using Angular.  It follows the MVVM pattern that I'm familiar with from WPF much more closely. 

### Runtime Configuration
- When running the application locally, configuration is stored in a .env file
- When running in AWS, configuration is stored in the Parameter Store

# AWS Deploy Steps

### Prereqs
1. An ECR repo for docker images
1. Google OAuth IdP info
1. Google Maps client info
1. An ACM Cert
1. a S3 bucket for terraform state

## Deployment
### Deploy the Backend
1. Navigate to the modular tf folder and run tf-apply to deploy the base infrastructure.
1. TODO: deploy the storage
1. Navigate to the backend code
1. publish something to ECR; run the publish-ecr script to do this.  The last step will fail because there isn't an ECS Service deployed yet - it's ok.
1. Navigate to the terraform folder in the backend and run tf-apply to deploy the backend.

### Deploy the Client
TODO

# AWS Deploy Steps (Deprecated)

### Prereqs
1. An ECR repo for docker images
1. Google OAuth IdP info
1. Google Maps client info
1. An ACM Cert
1. An S3 bucket for lambda build output

### Initial Deployment
1. Compile the app and deploy the artifacts to ECR and the S3 drop folder.
1. Run the terraform scripts; you'll need a few inputs that I'm not going to describe here because I just plain don't feel like it right now
1. The tf scripts will leave you with a few things
    1. Route53 routes to
    1. An ALB with
    1. A Target Group that points to 
    1. An ECS Fargate Service with
    1. A Task Definition that pulls the latest image from the ECR repo
    1. Also, a few Lambda functions for database setup along with 
    1. An RDS instance of PostgreSQL to supplement
    1. An S3 bucket for object storage
1. To initialize the database, go find the lambda that's named "setup" or "create" or whatever i called it and run it
1. You're done; you should be able to navigate to the app with a browser now. 

### Code Updates
You can update the application layer by making changes, recompiling and then republishing to ECR.  The ECS task is updated with the latest image simply by killing the existing task.  When a new one starts then it'll pull the latest image.

DB Schema updates are made by making changes to the scripts and then re-publishing the Lambda source to S3.  Then you can go to the Lambda console, update the "redeploy" function from the source bucket and then invoke that function.  It will drop and recreate the schema using the latest scripts.  You may also want to delete the files from the S3 bucket that relate to the metadata in RDS.

# TODOs
### Standard Priority
- replace the Internet Gateway with a Nat Gateway (make private subnets)
- replace the React frontend with an Angular frontend
- update DB Lambdas to not have passwords in the env vars
- sanity check and untangle the configuration

### Gold Plating
- update TF to support easily multiple environments
- split the static content from the service layer

### Gold Plated Cadillac
- support Azure deployments as well as AWS
