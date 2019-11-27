create table RunStats.ActivityInstance (
    ID int auto_increment primary key,
    FilePath longtext not null,
    DistanceMeters double not null,
    DurationSeconds int not null,
    StartTime datetime(6) not null,
    UUID varchar(36) not null
);