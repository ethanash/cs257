##Ethan Ash and Sam Gloss

import argparse
import csv
import sys
from datetime import datetime
##Made by Ethan Ash and Samuel Gloss


def get_parsed_arguments():
    '''
    parses arguments into an array of names, publish dates, and authors
    '''
    parser = argparse.ArgumentParser(description='Sort/filter a CSV formatted list of books and authors')
    parser.add_argument('file', metavar='file_name', help='the file containing the CSV formatted books')
    parser.add_argument('--title', '-t', help='the title of the books you seek')
    parser.add_argument('--author', '-a', help='the author of the books you seek')
    parser.add_argument('--year1', '-y1', help='the starting year range of the books you seek')
    parser.add_argument('--year2', '-y2', help='the ending year range of the books you seek')

    parsed_arguments = parser.parse_args()
    return parsed_arguments


def find_books_with_title(books, title):
  '''
  is given array of books, returns an array of books that contain a certain title
  '''
  books_to_return = []
  for book in books:
    book_title = book[0]
    if title.lower() in book_title.lower():
      books_to_return.append(book)
  return books_to_return


def find_books_with_author(books, author):
  '''
  is given array of books, returns an array of authors names that contain a certain string
  '''
  authors_to_return = []
  for book in books:
    book_author = book[2]
    if author.lower() in book_author.lower() and book_author not in authors_to_return:
      authors_to_return.append(book_author)
  return authors_to_return


def find_authors_books(books, author_name):
  '''
  gets all books published by an author
  '''
  books_to_return = []
  for book in books:
    book_author = book[2]
    if book_author == author_name:
      books_to_return.append(book)
  return books_to_return
      

  

def books_published_within_years(books, year1, year2):
  '''
  is given array of books and a range of years, and returns all books publihsed within those years, inclusive
  '''
  books_to_return = []
  start_year = int(year1)
  end_year = int(year2)
  for book in books:
    book_publish_date = book[1]
    if int(book_publish_date) >= start_year and int(book_publish_date) <= end_year:
      books_to_return.append(book)
  return books_to_return

def print_book_names(book_to_print, book_argument):
  '''
  prints info of given books
  '''
  print("Books that contain '" + book_argument + "' in their title:")
  books_returned = find_books_with_title(book_to_print,book_argument)
  for book in books_returned:
    print(book)

def print_author_and_their_books(books, authors_to_print, author_argument):
  '''
  prints a given set of authors and the books those authors have published
  '''
  print("Authors (and their books) that contain '" + author_argument + "' in their name:")
  for author_name in authors_to_print:
    print(author_name + ":")
    books_published = find_authors_books(books, author_name)
    i = 1
    for book in books_published:
      book_info = format_book_data_without_author(book)
      print(str(i) + '.')
      print(book_info)
      i = i + 1

def format_book_data_without_author(book):
  '''
  formats books information without author in preperation for printing with author name
  '''
  book_info = []
  for b in book:
    book_info.append(b)
  name_of_author = book_info[-1]
  del name_of_author
  return book_info

def print_books_during_years(year1,year2,books):
  '''
  prints the books that were published during certain years
  '''
  datem = int(datetime.now().year) #makes it so it is always the current year it is being run
  if not year1:
      year1 = 0
  if not year2:
      year2 = datem
  print("Books that were made between: " + str(year1) + " and " + str(year2))
  years_returned = books_published_within_years(books, year1, year2)
  for year in years_returned:
    print(year)
    

def get_book_list(file_name):
    '''
    gives a list of all the books from the filepath 
    '''
    books = []
    try: 
      file = open(file_name, newline='')
    except:
      print("Invalid Filepath. Goodbye.", file=sys.stderr)
      sys.exit()
    reader = csv.reader(file)
    for row in reader:
      books.append(row)
    return books


def main():
  '''
  parses command line arguments, and calls appropriate function for given commands, as well as the functions for printing the results
  '''
  arguments = get_parsed_arguments()
  if not arguments.file:
    print("Need a file please! Try again with a filepath ", file=sys.stderr)
    sys.exit()
  books = get_book_list(arguments.file)
  if arguments.book:
    books_to_print = find_books_with_title(books, arguments.book)
    print_book_names(books_to_print, arguments.book)
  if arguments.author:
    authors_to_print = find_books_with_author(books, arguments.author)
    print_author_and_their_books(books, authors_to_print, arguments.author)
  if arguments.year1 or arguments.year2:
    print_books_during_years(arguments.year1,arguments.year2, books)
    
    


  
if __name__ == "__main__":
    main()