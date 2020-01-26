create table RunStats.ActivityMetadata (
    ID int auto_increment primary key,
    DistanceMeters double not null,
    DurationSeconds int not null,
    StartTime int not null,
    UUID varchar(36) not null,
    UNIQUE(StartTime)
);