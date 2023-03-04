create table users (
  id serial primary key,
  name varchar(50) not null,
  email varchar(100) not null unique,
  password varchar(50) not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table event (
  id serial primary key,
  title varchar(100),
  description text,
  start_time timestamp not null,
  end_time timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  user_id int,
  constraint fk_user_id_event foreign key (user_id) references users (id)
);

create table time_entry (
  id serial primary key,
  start_time timestamp default now(),
  end_time timestamp not null,
  duration interval not null,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  user_id int,
  constraint fk_user_id_time_entry foreign key (user_id) references users (id)
);

CREATE OR REPLACE FUNCTION calculate_duration() RETURNS TRIGGER AS $$
BEGIN
  NEW.duration := EXTRACT(epoch FROM (NEW.end_time - NEW.start_time))::integer;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_duration
BEFORE INSERT OR UPDATE ON time_entry
FOR EACH ROW
EXECUTE FUNCTION calculate_duration();

INSERT INTO users (name, email, password)
VALUES ('Paul Lujan', 'paulglujan@gmail.com', 'test');