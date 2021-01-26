--Queries:

--List all the NOCs (National Olympic Committees), in alphabetical order by abbreviation. These entities, by the way, are mostly equivalent to countries. But in some cases, you might find that a portion of a country participated in a particular games (e.g. one guy from Newfoundland in 1904) or some other oddball situation.
SELECT noc FROM nocs ORDER BY noc

--List the names of all the athletes from Kenya. If your database design allows it, sort the athletes by last name.
SELECT athletes.athlete FROM athletes WHERE athletes_teams.athlete_id = athletes.id AND athletes_teams.team_id = (teams.id where teams.team = "Kenya")

--List all the medals won by Greg Louganis, sorted by year. Include whatever fields in this output that you think appropriate.
SELECT medals.medal FROM medals WHERE (medals.id = event_performances.medal_id and event_performances.athlete_id = (athletes.id where athletes.athlete = "%Greg Louganis%") ORDER BY games.year WHERE games)id = event_performances.game_id )

--List all the NOCs and the number of gold medals they have won, in decreasing order of the number of gold medals.
SELECT nocs.noc, COUNT(event_performances.medal_id) FROM nocs, medals WHERE event_performances.medal_id = medals.id AND (WHERE medals.medal = "Gold") GROUP BY nocs.noc where nocs.id = teams.noc_id (where teams.id = event_performance.team_id) ORDER BY count(event_performances.medal_id) DESC
