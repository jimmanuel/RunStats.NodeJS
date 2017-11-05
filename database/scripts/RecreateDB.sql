drop database if exists RunStats;
go;

create database RunStats;
go;

:r ..\schema\ActivityInstance.sql
:r ..\schema\DataPointInstance.sql
:r ..\scheam\SystemInformation.sql
go;

insert into SystemInformation(SchemaVersion) values('1.0');