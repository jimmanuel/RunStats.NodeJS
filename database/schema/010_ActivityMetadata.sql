create table RunStats.ActivityMetadata (
    ID serial primary key,
    DistanceMeters real not null,
    DurationSeconds int not null,
    StartTime int not null,
    UUID varchar(36) not null,
    UNIQUE(StartTime)
);