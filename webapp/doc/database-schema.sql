--Ethan Ash and Riaz Kelly--

CREATE TABLE public.player {
	id integer,
	short_name text,
	long_name text,
	age integer,
	position text,
	overall_rating integer,
	pace integer,
	shooting integer,
	passing integer,
	dribbling integer,
	defense integer,
	physicality integer,
	skill_moves integer,
	weak_foot integer,
	league_id integer,
	club_id integer,
	nationality_id integer,	
	preferred_foot_id integer
}

CREATE TABLE public.goalie {
	id integer,
	short_name text,
	long_name text,
	age integer,
	overall_rating integer,
	diving integer,
	handling integer,
	reflexes integer,
	kicking integer,
	speed integer,
	positioning integer,
	weak_foot integer,
	league_id integer,
	club_id integer,
	nationality_id integer,	
	preferred_foot_id integer
}

CREATE TABLE public.leagues {
	id integer,
	league text
}

CREATE TABLE public.clubs {
	id integer,
	club text
}

CREATE TABLE public.nationalities {
	id integer,
	nationality text
}

CREATE TABLE public.preferred_feet {
	id integer,
	preferred_foot text
}