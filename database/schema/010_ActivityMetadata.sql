create table RunStats.ActivityMetadata (
    ID bigserial primary key,
    UserID varchar(50) not null,
    DistanceMeters double precision not null,
    DurationSeconds bigint not null,
    StartTime bigint not null,
    UUID varchar(36) not null,
    UNIQUE(StartTime, UserID)
);