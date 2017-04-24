drop table if exists users; 
create table users (
	userId text primary key, 
	numUnits integer
); 

insert into users values("tim", "23");