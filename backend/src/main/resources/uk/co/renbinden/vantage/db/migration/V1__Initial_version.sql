create table panel_user(
    id varchar(36) primary key not null,
    version integer not null,
    username varchar(256) unique not null,
    password_hash bytea not null,
    password_salt bytea not null,
    status varchar(32)
);

create table audit_log(
    user_id varchar(36) not null,
    description varchar(2048) not null,
    time timestamptz not null,
    foreign key(user_id) references panel_user(id)
);