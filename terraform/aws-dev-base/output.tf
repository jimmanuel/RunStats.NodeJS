output "sg_rs_server_sg_id" {
    value = aws_security_group.sg-rs-webapp.id
}

output "alb_listener_arn" {
    value = aws_lb_listener.albl-rswebtier.arn
}

output "vpc_id" {
    value = aws_vpc.runstatsjs.id
}

output "ecs_cluster_id" {
    value = aws_ecs_cluster.ecs-cluster-rs.id
}

output "private_subnet_ids" {
    value = [ aws_subnet.rs-subnet.id, aws_subnet.rs-subnet-alt.id ]
}