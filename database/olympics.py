'''Ethan Ash'''

import argparse
import csv
import psycopg2

from config import password
from config import database
from config import user

def get_parsed_arguments():
    '''
    parses arguments from command line, checking for format
    '''
    parser = argparse.ArgumentParser(description='Sort/filter a database of athletes and performances from the olypmics')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--noc_athletes', '-na', help='lists all athletes from a specified NOC')
    group.add_argument('--noc_medals', '-nm', help='lists all the NOCs and the number of gold medals they have won, in decreasing order of the number of gold medals', action='store_true')
    group.add_argument('--noc_events', '-ne', type=int, help='in a given year, lists all of the NOCs and the events that they competed in')

    parsed_arguments = parser.parse_args()
    return parsed_arguments

def noc_athletes(database_cursor, noc_name):
    '''
    queries database for all athletes of a given noc and returns as a list
    '''
    query = '''SELECT athletes.athlete
        FROM athletes, athletes_teams, teams, nocs
        WHERE athletes_teams.athlete_id = athletes.id
        AND athletes_teams.team_id = teams.id 
        AND teams.noc_id = nocs.id
        AND nocs.noc = %s
        ORDER BY athletes.athlete'''
    
    try:
        database_cursor.execute(query, (noc_name,))
    except Exception as e:
        print(e)
        exit()
    
    noc_athletes = []
    for row in database_cursor:
        athlete_name = row[0]
        noc_athletes.append(athlete_name)

    return noc_athletes

def noc_medals(database_cursor):
    '''
    queries database for the number of gold medals each noc has won (in descending order)
    and returns as a 2d list
    '''
    query = '''SELECT nocs.noc, COUNT(event_performances.medal_id)
        FROM nocs, medals, event_performances, teams
        WHERE medals.medal = 'Gold'
        AND event_performances.medal_id = medals.id
        AND teams.id = event_performances.team_id
        AND teams.noc_id = nocs.id
        GROUP BY nocs.noc
        ORDER BY COUNT(event_performances.medal_id) DESC'''
    
    try:
        database_cursor.execute(query)
    except Exception as e:
        print(e)
        exit()
    
    noc_medals = []
    for row in database_cursor:
        noc_data = []

        noc_name = row[0]
        num_medals = row[1]

        noc_data.append(noc_name)
        noc_data.append(num_medals)

        noc_medals.append(noc_data)

    return noc_medals

def noc_events(database_cursor, year):
    '''
    queries database for all the events performed by all NOCs in a given year and returns
    them as a dictionary of lists
    '''
    query = '''SELECT nocs.noc, events.event
        FROM nocs, event_performances, teams, events, games
        WHERE event_performances.team_id = teams.id
        AND event_performances.event_id = events.id
        AND teams.noc_id = nocs.id
        AND event_performances.game_id = games.id
        AND games.year = %s
        ORDER BY nocs.noc'''
    try:
        database_cursor.execute(query, (year,))
    except Exception as e:
        print(e)
        exit()
    
    noc_events = {}
    for row in database_cursor:
        noc_name = row[0]
        event_name = row[1]

        if not noc_name in noc_events:
            noc_events[noc_name] = [event_name]
        else:
            events_list = noc_events[noc_name]
            events_list.append(event_name)

    return noc_events

def print_noc_athletes(noc_argument, noc_athletes_list):
    '''
    takes noc inputted and list and prints all of the noc's athletes
    '''
    print('===== All Athletes in {0} ====='.format(noc_argument))
    for athlete_name in noc_athletes_list:
        print(athlete_name)

def print_noc_medals(noc_medals_list):
    '''
    takes list and prints noc name and the number of medals they have won 
    '''
    print('===== Number of Gold Medals Won by Each NOC =====')
    for noc_data in noc_medals_list:
        noc_name = noc_data[0]
        num_medals = noc_data[1]
        print(noc_name, end=": ")
        print(num_medals, end=" ")
        print("Gold Medals")
        

def print_noc_events(year_argument, noc_events_list):
    '''
    takes year and dictionary and prints noc name and an indented list of events 
    participated in below it
    '''
    print('===== Events by NOC in {0} ====='.format(year_argument))
    for noc in noc_events_list:
        print(noc)
        for event_name in noc_events_list[noc]:
            print('\t' + event_name)


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

def main():
    '''
    connects to database, parses command line arguments, and calls appropriate function 
    for given flags, as well as the functions for printing the results
    '''

    database_connection = connect_to_database()
    database_cursor = database_connection.cursor()

    arguments = get_parsed_arguments()
    if arguments.noc_athletes:
        noc_athletes_list = noc_athletes(database_cursor, arguments.noc_athletes)
        print_noc_athletes(arguments.noc_athletes, noc_athletes_list)
    elif arguments.noc_medals:
        noc_medals_list = noc_medals(database_cursor)
        print_noc_medals(noc_medals_list)
    elif arguments.noc_events:
        noc_events_list = noc_events(database_cursor, arguments.noc_events)
        print_noc_events(arguments.noc_events, noc_events_list)
    
    database_connection.close()

  
if __name__ == "__main__":
    main()
