CREATE TABLE nocs (
id SERIAL,
noc text,
region text,
notes text
);

CREATE TABLE teams (
id SERIAL,
team text, 
noc_id integer
);

CREATE TABLE athletes (
id SERIAL, 
athlete text
);

CREATE TABLE athletes_teams (
id SERIAL, 
athlete_id integer,
Team_id integer
);

CREATE TABLE sports (
id SERIAL, 
sports text
);

CREATE TABLE events (
id SERIAL, 
sport_id integer, 
event text
);

CREATE TABLE games (
id SERIAL, 
year integer, 
season_id integer, 
city_id integer
);

CREATE TABLE seasons (
id SERIAL,
season text
);

CREATE TABLE cities (
id SERIAL,
city text
);

CREATE TABLE sexes (
id SERIAL,
sex text
);

CREATE TABLE medals(
id SERIAL,
medal text
);

CREATE TABLE event_performances (
id SERIAL,
athlete_id integer,
sex_id integer,
age integer,
height integer,
weight integer,
team_id integer,
game_id integer,
event_id integer,
medal_id integer
);

