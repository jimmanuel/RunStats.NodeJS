create table SystemInformation (
    ID int identity(1,1) primary key,
    SchemaVersion nvarchar(max) not null,
    LastUpdatedDate datetime2 not null constraint  [df_SystemInformation_LastUpdatedDate] default (sysutcdatetime())
);