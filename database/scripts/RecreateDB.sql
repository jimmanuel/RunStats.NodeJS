drop database if exists RunStats;
go

create database RunStats;
go

alter database RunStats set containment = partial
go

use RunStats;
go

:r ../schema/ActivityInstance.sql
:r ../schema/DataPointInstance.sql
:r ../schema/SystemInformation.sql
:r CreateUser.sql
go

insert into SystemInformation(SchemaVersion) values('1.0');
go