#! /bin/bash
/opt/mssql-tools/bin/sqlcmd -S .,1401 -U sa -i RecreateDB.sql
