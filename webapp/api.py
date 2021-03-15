'''
    Ethan Ash and Riaz Kelly
    Flask API to support the FIFA draft webapp
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

tokens = dict()
user_first_name = ''
user_last_name = ''
user_email = ''

@api.route('/help')
def help():
    return('''API Endpoints:
    /players - will return JSON output of players
    /sandbox - will show sandbox mode where you can search for players

    See readme.txt for more filters and examples.
    ''')

@api.route('/leagues')
def get_leagues():
    league = flask.request.args.get('league', default = '')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT league.league
               FROM league
               WHERE UPPER(league.league) LIKE UPPER(%s)'''

    try:
        database_cursor.execute(query, ('%'+league+'%',))
    except Exception as e:
        print(e)
        exit()

    leagues = []
    for row in database_cursor:
        league = {}
        league_name = row[0]
        league['league'] = league_name
        leagues.append(league)

    return json.dumps(leagues)

@api.route('/clubs')
def get_clubs():
    club = flask.request.args.get('club', default = '')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT club.club
               FROM club
               WHERE UPPER(club.club) LIKE UPPER(%s)'''

    try:
        database_cursor.execute(query, ('%'+club+'%',))
    except Exception as e:
        print(e)
        exit()

    clubs = []
    for row in database_cursor:
        club = {}
        club_name = row[0]
        club['club'] = club_name
        clubs.append(club)

    return json.dumps(clubs)

@api.route('/nationalities')
def get_nationalities():
    nationality = flask.request.args.get('nationality', default = '')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT nationality.nationality
               FROM nationality
               WHERE UPPER(nationality.nationality) LIKE UPPER(%s)'''

    try:
        database_cursor.execute(query, ('%'+nationality+'%',))
    except Exception as e:
        print(e)
        exit()

    nationalities = []
    for row in database_cursor:
        nationality = {}
        nationality_name = row[0]
        nationality['nationality'] = nationality_name
        nationalities.append(nationality)

    return json.dumps(nationalities)

@api.route('/goalies')
def get_goalies():
    nationality = flask.request.args.get('nationality', default = '')
    club = flask.request.args.get('club', default = '')
    league = flask.request.args.get('league', default = '')
    weakFootLow = flask.request.args.get('weakfootlow', default = -1)
    weakFootHigh = flask.request.args.get('weakfoothigh', default = 6)
    preferredFoot = flask.request.args.get('preferredfoot', default = '')
    divingLow = flask.request.args.get('divingLow', default = 0)
    divingHigh = flask.request.args.get('divingHigh', default = 99)
    handlingLow = flask.request.args.get('handlingLow', default = 0)
    handlingHigh = flask.request.args.get('handlingHigh', default = 99)
    reflexesLow = flask.request.args.get('reflexesLow', default = 0)
    reflexesHigh = flask.request.args.get('reflexesHigh', default = 99)
    kickingLow = flask.request.args.get('kickingLow', default = 0)
    kickingHigh = flask.request.args.get('kickingHigh', default = 99)
    speedLow = flask.request.args.get('speedLow', default = 0)
    speedHigh = flask.request.args.get('speedHigh', default = 99)
    positioningLow = flask.request.args.get('positioningLow', default = 0)
    positioningHigh = flask.request.args.get('positioningHigh', default = 99)
    overallRatingLow = flask.request.args.get('overallRatingLow', default = 0)
    overallRatingHigh = flask.request.args.get('overallRatingHigh', default = 99)
    ageLow = flask.request.args.get('ageLow', default = 0)
    ageHigh = flask.request.args.get('ageHigh', default = 99)
    name = flask.request.args.get('name', default = '')
    sofifa_id = flask.request.args.get('sofifa_id', default = -1)
    draftModeOn = flask.request.args.get('draftmodeon', default = '')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT goalie.long_name, goalie.diving, goalie.handling, goalie.reflexes,
    		   goalie.kicking, goalie.speed, goalie.positioning, nationality.nationality,
    		   league.league, club.club, goalie.overall_rating, goalie.sofifa_id, goalie.id,
               goalie.age, goalie.weak_foot, goalie.preferred_foot
               FROM goalie, nationality, club, league
               WHERE goalie.nationality_id = nationality.id
               AND UPPER(nationality.nationality) LIKE UPPER(%s)
               AND goalie.league_id = league.id
               AND UPPER(league.league) LIKE UPPER(%s)
               AND goalie.club_id = club.id
               AND UPPER(club.club) LIKE UPPER(%s)
               AND goalie.diving > %s AND goalie.diving < %s
               AND goalie.handling > %s AND goalie.handling < %s
               AND goalie.reflexes > %s AND goalie.reflexes < %s
               AND goalie.kicking > %s AND goalie.kicking < %s
               AND goalie.speed > %s AND goalie.speed < %s
               AND goalie.positioning > %s AND goalie.positioning < %s
               AND goalie.age > %s AND goalie.age < %s
               AND goalie.overall_rating > %s AND goalie.overall_rating < %s
               AND (goalie.sofifa_id = %s OR %s < 0)
               AND UPPER(goalie.long_name) LIKE UPPER(%s)
               AND goalie.weak_foot > %s AND goalie.weak_foot < %s
               AND UPPER(goalie.preferred_foot) LIKE UPPER(%s)'''

    try:
        database_cursor.execute(query, (('%'+nationality+'%'), ('%'+league+'%'), ('%'+club+'%'),
        divingLow, divingHigh, handlingLow, handlingHigh, reflexesLow, reflexesHigh, kickingLow,
        kickingHigh, speedLow, speedHigh, positioningLow, positioningHigh, ageLow, ageHigh,
        overallRatingLow, overallRatingHigh, sofifa_id, sofifa_id, ('%'+name+'%'),
        weakFootLow, weakFootHigh, ('%'+preferredFoot+'%')))
    except Exception as e:
        print(e)
        exit()

    goalies = []
    for row in database_cursor:
        goalie = {}
        goalie_name = row[0]
        goalie_diving = row[1]
        goalie_handling = row[2]
        goalie_reflexes = row[3]
        goalie_kicking = row[4]
        goalie_speed = row[5]
        goalie_positioning = row[6]
        goalie_nationality = row[7]
        goalie_league = row[8]
        goalie_club = row[9]
        goalie_overall = row[10]
        goalie_sofifa_id = row[11]
        goalie_id = row[12]
        goalie_age = row[13]
        goalie_weak_foot = row[14]
        goalie_preferred_foot = row[15]
        goalie['position'] = 'GK'
        goalie['name'] = goalie_name
        goalie['diving'] = goalie_diving
        goalie['handling'] = goalie_handling
        goalie['reflexes'] = goalie_reflexes
        goalie['kicking'] = goalie_kicking
        goalie['speed'] = goalie_speed
        goalie['positioning'] = goalie_positioning
        goalie['nationality'] = goalie_nationality
        goalie['league'] = goalie_league
        goalie['club'] = goalie_club
        goalie['overall'] = goalie_overall
        goalie['sofifa_id'] = goalie_sofifa_id
        goalie['goalie_id'] = goalie_id
        goalie['age'] = goalie_age
        goalie['weak_foot'] = goalie_weak_foot
        goalie['preferred_foot'] = goalie_preferred_foot
        goalies.append(goalie)

    if not draftModeOn:
        random.shuffle(goalies)

    return json.dumps(goalies)

@api.route('/players')
def get_players():
    nationality = flask.request.args.get('nationality', default = '')
    club = flask.request.args.get('club', default = '')
    league = flask.request.args.get('league', default = '')
    weakFootLow = flask.request.args.get('weakfootlow', default = -1)
    weakFootHigh = flask.request.args.get('weakfoothigh', default = 6)
    skillMovesLow = flask.request.args.get('skillmoveslow', default = -1)
    skillMovesHigh = flask.request.args.get('skillmoveshigh', default = 6)
    preferredFoot = flask.request.args.get('preferredfoot', default = '')
    shootingLow = flask.request.args.get('shootinglow', default = 0)
    shootingHigh = flask.request.args.get('shootinghigh', default = 99)
    paceLow = flask.request.args.get('pacelow', default = 0)
    paceHigh = flask.request.args.get('pacehigh', default = 99)
    dribblingLow = flask.request.args.get('dribblinglow', default = 0)
    dribblingHigh = flask.request.args.get('dribblinghigh', default = 99)
    passingLow = flask.request.args.get('passinglow', default = 0)
    passingHigh = flask.request.args.get('passinghigh', default = 99)
    defenseLow = flask.request.args.get('defenselow', default = 0)
    defenseHigh = flask.request.args.get('defensehigh', default = 99)
    physicalityLow = flask.request.args.get('physicalitylow', default = 0)
    physicalityHigh = flask.request.args.get('physicalityhigh', default = 99)
    overallRatingLow = flask.request.args.get('overallratinglow', default = 0)
    overallRatingHigh = flask.request.args.get('overallratinghigh', default = 99)
    position = flask.request.args.get('position', default = '')
    ageLow = flask.request.args.get('agelow', default = 0)
    ageHigh = flask.request.args.get('agehigh', default = 99)
    name = flask.request.args.get('name', default = '')
    sofifa_id = flask.request.args.get('sofifa_id', default = -1)
    draftModeOn = flask.request.args.get('draftmodeon', default = True)

    # print(preferredFoot)
    # print(weakFootLow + weakFootHigh + skillMovesLow + skillMovesHigh)

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT player.long_name, player.shooting, player.dribbling, player.pace,
               player.passing, player.defense, player.position,
               nationality.nationality, league.league, club.club, player.overall_rating,
               player.sofifa_id, player.physicality, player.id,
               player.age, player.weak_foot, player.preferred_foot, player.skill_moves
               FROM player, nationality, club, league
               WHERE player.nationality_id = nationality.id
               AND UPPER(nationality.nationality) LIKE UPPER(%s)
               AND player.league_id = league.id
               AND UPPER(league.league) LIKE UPPER(%s)
               AND player.club_id = club.id
               AND UPPER(club.club) LIKE UPPER(%s)
               AND player.position LIKE UPPER(%s)
               AND player.shooting > %s AND player.shooting < %s
               AND player.dribbling > %s AND player.dribbling < %s
               AND player.pace > %s AND player.pace < %s
               AND player.passing > %s AND player.passing < %s
               AND player.defense > %s AND player.defense < %s
               AND player.physicality > %s AND player.physicality < %s
               AND player.age > %s AND player.age < %s
               AND player.overall_rating > %s AND player.overall_rating < %s
               AND (player.sofifa_id = %s OR %s < 0)
               AND UPPER(player.long_name) LIKE UPPER(%s)
               AND player.weak_foot > %s AND player.weak_foot < %s
               AND player.skill_moves > %s AND player.skill_moves < %s
               AND UPPER(player.preferred_foot) LIKE UPPER(%s)'''

    try:
        database_cursor.execute(query, (('%'+nationality+'%'), ('%'+league+'%'), ('%'+club+'%'), ('%'+position+'%'),
        shootingLow, shootingHigh, dribblingLow, dribblingHigh, paceLow, paceHigh, passingLow, passingHigh,
        defenseLow, defenseHigh, physicalityLow, physicalityHigh, ageLow, ageHigh, overallRatingLow,
        overallRatingHigh, sofifa_id, sofifa_id, ('%'+name+'%'), weakFootLow, weakFootHigh, skillMovesLow,
        skillMovesHigh, ('%'+preferredFoot+'%')))
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
        player_overall = row[10]
        player_sofifa_id = row[11]
        player_physicality = row[12]
        player_id = row[13]
        player_age = row[14]
        player_weak_foot = row[15]
        player_preferred_foot = row[16]
        player_skill_moves = row[17]
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
        player['overall'] = player_overall
        player['sofifa_id'] = player_sofifa_id
        player['physicality'] = player_physicality
        player['player_id'] = player_id
        player['age'] = player_age
        player['weak_foot'] = player_weak_foot
        player['preferred_foot'] = player_preferred_foot
        player['skill_moves'] = player_skill_moves
        players.append(player)

    if not draftModeOn:
        random.shuffle(players)
    #players = [{'name':'Leonel Messi', 'shooting':90, 'dribbling':85, 'pace':98, 'passing':'86', 'defense':74, 'nationality':'Argentina', 'club':'Barcelona'},
            #{'name':'Christiano Renaldo', 'shooting':92, 'dribbling':91, 'pace':96, 'passing':'89', 'defense':72, 'nationality':'Portugal', 'club':'Juventus'}]

    return json.dumps(players)

@api.route('/teamplayers')
def get_team_players():
    team_id = flask.request.args.get('teamid')

    players = []

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT account_team.formation
               FROM account_team
               WHERE account_team.id = %s
               AND account_team.account_id = %s'''

    try:
        token = request.cookies.get('sessionToken')
        account_id = tokens[token]
        database_cursor.execute(query, (team_id, account_id))
    except Exception as e:
        print(e)
        exit()
    formation = {}
    for row in database_cursor:
        formation["formation"] = row[0]

    players.append(formation)


    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT player.long_name, player.shooting, player.dribbling, player.pace,
               player.passing, player.defense, player.position,
               nationality.nationality, league.league, club.club, player.overall_rating,
               player.sofifa_id, player.physicality, player.id, account_player.player_location,
               player.age, player.weak_foot, player.preferred_foot, player.skill_moves
               FROM player, nationality, club, league, account_player, account, account_team
               WHERE player.nationality_id = nationality.id
               AND player.league_id = league.id
               AND player.club_id = club.id
               AND account_player.account_team_id = %s
               AND account_team.id = %s
               AND account_team.account_id = %s
               AND player.id = account_player.player_id'''

    try:
        token = request.cookies.get('sessionToken')
        account_id = tokens[token]
        database_cursor.execute(query, (team_id, team_id, account_id))
    except Exception as e:
        print(e)
        exit()

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
        player_overall = row[10]
        player_sofifa_id = row[11]
        player_physicality = row[12]
        player_id = row[13]
        player_location = row[14]
        player_age = row[15]
        player_weak_foot = row[16]
        player_preferred_foot = row[17]
        player_skill_moves = row[18]
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
        player['overall'] = player_overall
        player['sofifa_id'] = player_sofifa_id
        player['physicality'] = player_physicality
        player['player_id'] = player_id
        player['location'] = player_location
        player['age'] = player_age
        player['weak_foot'] = player_weak_foot
        player['preferred_foot'] = player_preferred_foot
        player['skill_moves'] = player_skill_moves
        players.append(player)

    return json.dumps(players)

@api.route('/teamgoalies')
def get_team_goalies():
    team_id = flask.request.args.get('teamid')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''SELECT goalie.long_name, goalie.diving, goalie.handling, goalie.reflexes,
    		   goalie.kicking, goalie.speed, goalie.positioning, nationality.nationality,
    		   league.league, club.club, goalie.overall_rating, goalie.sofifa_id, goalie.id,
               goalie.age, goalie.weak_foot, goalie.preferred_foot
               FROM goalie, nationality, club, league, account_goalie, account, account_team
               WHERE nationality.id = goalie.nationality_id
               AND club.id = goalie.club_id
               AND league.id = goalie.league_id
               AND account_goalie.account_team_id = %s
               AND account_team.id = %s
               AND account_team.account_id = %s
               AND goalie.id = account_goalie.goalie_id'''

    try:
        token = request.cookies.get('sessionToken')
        account_id = tokens[token]
        database_cursor.execute(query, (team_id, team_id, account_id))
    except Exception as e:
        print(e)
        exit()

    goalies = []

    for row in database_cursor:
        goalie = {}
        goalie_name = row[0]
        goalie_diving = row[1]
        goalie_handling = row[2]
        goalie_reflexes = row[3]
        goalie_kicking = row[4]
        goalie_speed = row[5]
        goalie_positioning = row[6]
        goalie_nationality = row[7]
        goalie_league = row[8]
        goalie_club = row[9]
        goalie_overall = row[10]
        goalie_sofifa_id = row[11]
        goalie_id = row[12]
        goalie_age = row[13]
        goalie_weak_foot = row[14]
        goalie_preferred_foot = row[15]
        goalie['name'] = goalie_name
        goalie['diving'] = goalie_diving
        goalie['handling'] = goalie_handling
        goalie['reflexes'] = goalie_reflexes
        goalie['kicking'] = goalie_kicking
        goalie['speed'] = goalie_speed
        goalie['positioning'] = goalie_positioning
        goalie['nationality'] = goalie_nationality
        goalie['league'] = goalie_league
        goalie['club'] = goalie_club
        goalie['overall'] = goalie_overall
        goalie['sofifa_id'] = goalie_sofifa_id
        goalie['goalie_id'] = goalie_id
        goalie['age'] = goalie_age
        goalie['weak_foot'] = goalie_weak_foot
        goalie['preferred_foot'] = goalie_preferred_foot
        goalies.append(goalie)

    return json.dumps(goalies)


@api.route('/accountteams')
def get_account_teams():
    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    #team_id = flask.request.args.get('teamid', default=-1)

    query = '''SELECT account_team.id, account_team.team_name
            FROM account_team
            WHERE account_team.account_id = %s'''

    #AND (account_team.id = %s OR %s < 0)
    try:
        token = request.cookies.get('sessionToken')
        account_id = tokens[token]
        database_cursor.execute(query, (account_id,))
    except Exception as e:
        print(e)
        exit()

    teams = []

    for row in database_cursor:
        team = {}
        team["id"] = row[0]
        team["name"] = row[1]
        teams.append(team)

    return json.dumps(teams)

@api.route('/createteam/<formation>')
def create_account_team(formation):
    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''INSERT INTO account_team(account_id, team_name, formation)
            VALUES (%s, %s, %s)
            RETURNING id, team_name'''
    try:
        token = request.cookies.get('sessionToken')
        account_id = tokens[token]
        database_cursor.execute(query, (account_id, "New Draft", formation))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()
    teams = []
    for row in database_cursor:
        team = {}
        team["id"] = row[0]
        team["name"] = row[1]
        teams.append(team)
    return json.dumps(teams)

@api.route('/deleteteam')
def delete_team():
    team_id = flask.request.args.get('teamid')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''DELETE FROM account_team
            WHERE id = %s'''
    try:
        database_cursor.execute(query, (team_id,))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''DELETE FROM account_player
            WHERE account_team_id = %s'''
    try:
        database_cursor.execute(query, (team_id,))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()

    return 'SUCCESSFULLY DELETED'

@api.route('/changeteamname')
def change_team_name():
    player_id = flask.request.args.get('teamid')
    team_name = flask.request.args.get('name')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''UPDATE account_team
            SET team_name = %s
            WHERE id = %s
            RETURNING id, team_name'''
    try:
        database_cursor.execute(query, (team_name, player_id))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()
    teams = []
    for row in database_cursor:
        team = {}
        team["id"] = row[0]
        team["name"] = row[1]
        teams.append(team)
    return json.dumps(teams)

@api.route('/addplayer')
def add_player_to_team():
    player_id = flask.request.args.get('playerid')
    team_id = flask.request.args.get('teamid')
    player_location = flask.request.args.get('playerlocation')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''INSERT INTO account_player(account_team_id, player_id, player_location)
            VALUES (%s, %s, %s)'''
    try:
        database_cursor.execute(query, (team_id, player_id, player_location))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()
    return 'PLAYER ADDED'

@api.route('/addgoalie')
def add_goalie_to_team():
    goalie_id = flask.request.args.get('goalieid')
    team_id = flask.request.args.get('teamid')

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    query = '''INSERT INTO account_goalie(account_team_id, goalie_id)
            VALUES (%s, %s)'''
    try:
        database_cursor.execute(query, (team_id, goalie_id))
        database_connection.commit()
    except Exception as e:
        print(e)
        exit()
    return 'GOALIE ADDED'


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
