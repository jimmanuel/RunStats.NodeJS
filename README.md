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
1. Navigate to the modular tf folder and run app-deploy.sh to deploy the base infrastructure.
1. TODO: deploy the storage
1. Navigate to the backend code
1. publish something to ECR; run the publish-ecr script to do this.  The last step will fail because there isn't an ECS Service deployed yet - it's ok.
1. Navigate to the terraform folder in the backend and run app-deploy.sh to deploy the backend.

### Deploy the Client
1. Navigate to the static proxy terraform folder and run app-deploy.sh; this will make an S3 bucket hooked up to the ALB via alambda to serve static content at our desired URL
1. Navigate to the client application folder and run app-deploy.sh; this populates the bucket with the static content (client application).

### Code Updates
Backend Server: run publish-ecr.sh to rebuild and publish a new docker image to ECR, and then force the ECS Service to update tasks.

Client Application: run app-deploy.sh from the client folder to re-sync the compiled client to the S3 bucket that stores the static content.

Coming Soon:
DB Schema updates are made by making changes to the scripts and then re-publishing the Lambda source to S3.  Then you can go to the Lambda console, update the "redeploy" function from the source bucket and then invoke that function.  It will drop and recreate the schema using the latest scripts.  You may also want to delete the files from the S3 bucket that relate to the metadata in RDS.

# TODOs
### Standard Priority
- replace the Internet Gateway with a Nat Gateway (make private subnets)
- replace the React frontend with an Angular frontend
- update DB Lambdas to not have passwords in the env vars
- sanity check and untangle the configuration
- terraform the DB module so that we have persistent storage again

### Gold Plating
- update TF to support easily multiple environments

### Gold Plated Cadillac
- support Azure deployments as well as AWS
