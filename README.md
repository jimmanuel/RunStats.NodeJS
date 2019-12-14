# RunStats.NodeJS
Welcome to the Node JS flavor of RunStats.

This project serves multiple purposes:
- Replicate functionality from a popular Keeper of Running Data web site that now requires a paid subscription to use
- Let me learn about building web apps using the NodeJS/Angular/React tech stack
- Let me learn how to deploy and run an app on AWS

My target is to build a web application that parses and performs data analysis on my running activities.  I use the Run Keeper application record those activities and then export them to GPX format; that makes the data easy to ingest and do whatever I want with it.  The targetted tech stack is NodeJS and Angular/React (I haven't decided) for the application code and a SQL Server / S3 bucket for data storage.  

A few more things of note:
- this project is for my benefit; feel free to pull/fork/clone/do whatever you want with it but it comes with no warranty and no support
- I've been able to dedicate short periods of time to the project recently but not large chucks and also not consistently.  Don't expect regular updates.
- the original version of this app was as an Android application
- I'm comfortable with SQL and Node JS but not Angular or React.  Expect a high wtf/sloc ratio in those areas.

Tech Notes
- I built an adapter layer so that I can easily switch between storing data in AWS native services or storing all data in memory in order to run it locally.  This should also allow me to build a layer to learn Azure or Google cloud storage later.
- I started integrating a proper DI library (inversify) but it became a bit of over-enginnering for what I needed.  I reverted to the pinciples of KISS and YAGNI.  If and when the home rolled Inversion of Control implementation becomes too much to maintain, I'l revisit that decision.
- Test coverage is horrible.
