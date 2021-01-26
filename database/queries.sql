--Queries:

--List all the NOCs (National Olympic Committees), in alphabetical order by abbreviation. These entities, by the way, are mostly equivalent to countries. But in some cases, you might find that a portion of a country participated in a particular games (e.g. one guy from Newfoundland in 1904) or some other oddball situation.
SELECT noc
FROM nocs
ORDER BY noc;

--List the names of all the athletes from Kenya. If your database design allows it, sort the athletes by last name.
SELECT athletes.athlete
FROM athletes, athletes_teams, teams
WHERE athletes_teams.athlete_id = athletes.id 
AND athletes_teams.team_id = teams.id AND teams.team = 'Kenya';

--List all the medals won by Greg Louganis, sorted by year. Include whatever fields in this output that you think appropriate.
SELECT event_performances, medals.medal
FROM medals, event_performances, athletes, games
WHERE athletes.athlete = 'Gregory Efthimios "Greg" Louganis'
AND medals.id = event_performances.medal_id
AND event_performances.athlete_id = athletes.id
AND games.id = event_performances.game_id
ORDER BY games.year;

--List all the NOCs and the number of gold medals they have won, in decreasing order of the number of gold medals.
SELECT nocs.noc, COUNT(event_performances.medal_id)
FROM nocs, medals
WHERE event_performances.medal_id = medals.id
AND (WHERE medals.medal = 'Gold')
GROUP BY nocs.noc WHERE nocs.id = teams.noc_id
(WHERE teams.id = event_performance.team_id)
ORDER BY count(event_performances.medal_id) DESC;
