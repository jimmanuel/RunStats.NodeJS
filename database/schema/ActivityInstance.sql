create table ActivityInstance (
    ID int identity(1,1) primary key,
    FilePath nvarchar(max) not null,
    DistanceMeters float not null,
    DurationSeconds int not null,
    StartTime datetime2 not null
);
go
