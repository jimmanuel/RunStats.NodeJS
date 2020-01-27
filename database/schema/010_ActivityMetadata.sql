create table RunStats.ActivityMetadata (
    ID bigserial primary key,
    DistanceMeters double precision not null,
    DurationSeconds bigint not null,
    StartTime bigint not null,
    UUID varchar(36) not null,
    UNIQUE(StartTime)
);