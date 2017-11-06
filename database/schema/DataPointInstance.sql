CREATE TABLE DataPointInstance (
    ID int identity(1,1) primary key,
    ActivityID int foreign key references ActivityInstance(ID),
    InstanceDateTime datetime2 not null,
    Latitude float not null,
    Longitude float not null
);
go
