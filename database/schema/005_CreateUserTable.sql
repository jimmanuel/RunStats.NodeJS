create table RunStats.Users (
    ID bigserial primary key,
    SourceID bigint not null,
    EmailAddress varchar(256) not null
);
	
CREATE UNIQUE INDEX idx_source_id 
ON RunStats.Users(SourceID);