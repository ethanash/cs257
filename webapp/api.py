'''
    Ethan Ash and Riaz Kelly

    Tiny Flask API to support the FIFA draft webapp
'''
import sys
import flask
import json
import config
import psycopg2
import random
from flask import request

from config import password
from config import database
from config import user

api = flask.Blueprint('api', __name__)

@api.route('/players')
def get_players():
    nationality=request.args.get('nationality')
    club=request.args.get('club')
    league=request.args.get('league')
    weakFootLow=request.args.get('weakfootlow')
    weakFootHigh=request.args.get('weakfoothigh')
    skillMovesLow=request.args.get('skillmoves')
    skillMovesHigh=request.args.get('skillmoves')
    preferredFoot=request.args.get('preferredfoot')
    shootingLow=request.args.get('shooting')
    shootingHigh=request.args.get('shooting')
    paceLow=request.args.get('pace')
    paceHigh=request.args.get('pace')
    dribblingLow=request.args.get('dribbling')
    dribblingHigh=request.args.get('dribbling')
    passingLow=request.args.get('passing')
    passingHigh=request.args.get('passing')
    defenseLow=request.args.get('defense')
    defenseHigh=request.args.get('defense')
    physicalityLow=request.args.get('physicality')
    physicalityHigh=request.args.get('physicality')
    overallRatingLow=request.args.get('overallrating')
    overallRatingHigh=request.args.get('overallrating')
    position=request.args.get('position')
    ageLow=request.args.get('age')
    ageHigh=request.args.get('age')
    name=request.args.get('name')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT player.long_name, player.shooting, player.dribbling, player.pace, player.passing, player.defense, player.position, nationalities.nationality, leagues.league, clubs.club
        FROM players, nationalities, clubs, leagues
        WHERE players.nationality_id = nationalities.id
        AND players.league_id = leagues.id
        AND players.club_id = clubs.id'''

    try:
        database_cursor.execute(query, (year,))
    except Exception as e:
        print(e)
        exit()
    players = []
    for row in database_cursor:
        player = {}
        player_name = row[0]
        player_shooting = row[1]
        player_dribbling = row[2]
        player_pace= row[3]
        player_passing = row[4]
        player_defense = row[5]
        player_position = row[6]
        player_nationality = row[7]
        player_league = row[8]
        player_club = row[9]
        player['name'] = player_name
        player['shooting'] = player_shooting
        player['dribbling'] = player_dribbling
        player['pace'] = player_pace
        player['passing'] = player_passing
        player['defense'] = player_defense
        player['position'] = player_position
        player['nationality'] = player_nationality
        player['league'] = player_league
        player['club'] = player_club
        players.append(player)
    
    random.shuffle(players)
    players = [{'name':'Leonel Messi', 'shooting':90, 'dribbling':85, 'pace':98, 'passing':'86', 'defense':74, 'nationality':'Argentina', 'club':'Barcelona'},
            {'name':'Christiano Renaldo', 'shooting':92, 'dribbling':91, 'pace':96, 'passing':'89', 'defense':72, 'nationality':'Portugal', 'club':'Juventus'}]
    
    return json.dumps(players)

def connect_to_database():
    '''
    Connect to the database and return a connection object
    '''
    try:
        connection = psycopg2.connect(database=database, user=user, password=password)
    except Exception as e:
        print(e)
        exit()
    return connection
