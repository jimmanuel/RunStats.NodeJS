create table RunStats.ActivityInstance (
    ID int auto_increment primary key,
    DistanceMeters double not null,
    DurationSeconds int not null,
    StartTime int not null,
    UUID varchar(36) not null
);