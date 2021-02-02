'''
    Ethan Ash and Ross Grogan-Kaylor
'''
import sys
import argparse
import flask
import json
import psycopg2

from config import password
from config import database
from config import user

# Connect to the database
try:
	connection = psycopg2.connect(database=database, user=user, password=password)
except Exception as e:
    print(e)
    exit()

app = flask.Flask(__name__)

'''
RESPONSE: a JSON list of dictionaries, each of which represents one
Olympic games, sorted by year. Each dictionary in this list will have
the following fields.

   id -- (INTEGER) a unique identifier for the games in question
   year -- (INTEGER) the 4-digit year in which the games were held (e.g. 1992)
   season -- (TEXT) the season of the games (either "Summer" or "Winter")
   city -- (TEXT) the host city (e.g. "Barcelona")
'''
@app.route('/games')
def get_games():
    try:
        cursor = connection.cursor()
        query = '''SELECT games.id, games.year, seasons.season, cities.city 
            FROM games, seasons, cities 
            WHERE games.season_id = seasons.id 
            AND games.city_id = cities.id 
            ORDER BY games.year'''
        cursor.execute(query)
    except Exception as e:
        print(e)
        exit()
    games_list = []
    for row in cursor:
        game_id = row[0]
        game_year = row[1]
        game_season = row[2]
        game_city = row[3]
        games_list.append({"id":game_id, "year":game_year, "season":game_season, "city":game_city})
    return json.dumps(games_list)

'''
RESPONSE: a JSON list of dictionaries, each of which represents one
National Olympic Committee, alphabetized by NOC abbreviation. Each dictionary
in this list will have the following fields.

   abbreviation -- (TEXT) the NOC's abbreviation (e.g. "USA", "MEX", "CAN", etc.)
   name -- (TEXT) the NOC's full name (see the noc_regions.csv file)
'''
@app.route("/nocs")
def nocs():
    try:
        cursor = connection.cursor()
        query = 'SELECT nocs.noc, nocs.region FROM nocs'
        cursor.execute(query)
    except Exception as e:
        print(e)
        exit()

    nocs_list = []
    for row in cursor:
        noc_abbreviation = row[0]
        noc_region = row[1]
        nocs_list.append({"abbreviation":noc_abbreviation,"region":noc_region})

    return json.dumps(nocs_list)

'''
REQUEST: /medalists/games/<games_id>?[noc=noc_abbreviation]

RESPONSE: a JSON list of dictionaries, each representing one athlete
who earned a medal in the specified games. Each dictionary will have the
following fields.

   athlete_id -- (INTEGER) a unique identifier for the athlete
   athlete_name -- (INTEGER) a unique identifier for the athlete
   athlete_sex -- (TEXT) the athlete's sex as specified in the database ("F" or "M")
   sport -- (TEXT) the name of the sport in which the medal was earned
   event -- (TEXT) the name of the event in which the medal was earned
   medal -- (TEXT) the type of medal ("gold", "silver", or "bronze")

If the GET parameter noc=noc_abbreviation is present, this endpoint will return
only those medalists who were on the specified NOC's team during the specified
games.
'''
@app.route('/medalists/games/<games_id>')
def get_actor(games_id):
    try:
        cursor = connection.cursor()
        query = '''SELECT athletes.id, athletes.athlete, sexes.sex, sports.sports, events.event, medals.medal, nocs.noc 
            FROM athletes, sexes, sports, events, medals, nocs, event_performances, teams 
            WHERE event_performances.game_id = %s 
            AND event_performances.athlete_id = athletes.id 
            AND sexes.id = event_performances.sex_id 
            AND medals.id = event_performances.medal_id 
            AND event_performances.event_id = events.id 
            AND events.sport_id = sports.id 
            AND event_performances.team_id = teams.id 
            AND teams.noc_id = nocs.id ORDER BY athletes.athlete'''
        cursor.execute(query, (games_id,))
    except Exception as e:
        print(e)
        exit()

    noc = flask.request.args.get('noc')

    athletes_list = []
    for row in cursor:
        if noc:
            athlete_noc = row[6]
            if athlete_noc == noc:
                athlete_id = row[0]
                athlete_name = row[1]
                athlete_sex = row[2]
                sport = row[3]
                event = row[4]
                medal = row[5]
                athletes_list.append({"athlete_id" : athlete_id, "athlete_name" : athlete_name, "athlete_sex" : athlete_sex, "sport" : sport, "event": event, "medal" : medal})
        else:
            athlete_id = row[0]
            athlete_name = row[1]
            athlete_sex = row[2]
            sport = row[3]
            event = row[4]
            medal = row[5]
            athletes_list.append({"athlete_id" : athlete_id, "athlete_name" : athlete_name, "athlete_sex" : athlete_sex, "sport" : sport, "event": event, "medal" : medal})

    return json.dumps(athletes_list)

if __name__ == '__main__':
    parser = argparse.ArgumentParser('A Flask application/API for the Olympic database')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)