import argparse
import csv
from datetime import datetime
##Made by Ethan Ash and Samuel Gloss

#parses arguments into an array of names, publish dates, and authors
def get_parsed_arguments():
    parser = argparse.ArgumentParser(description='Sort/filter a CSV formatted list of books and authors')
    parser.add_argument('file', metavar='-f', help='the file containing the CSV formatted books')
    parser.add_argument('--book', '-b', help='the title of the books you seek')
    parser.add_argument('--author', '-a', help='the author of the books you seek')
    parser.add_argument('--year1', '-y1', help='the starting year range of the books you seek')
    parser.add_argument('--year2', '-y2', help='the ending year range of the books you seek')

    parsed_arguments = parser.parse_args()
    return parsed_arguments

#is given array of books, returns an array of books that contain a certain title
def title(books, title):
  booksToReturn = []
  for book in books:
    if title.lower() in book[0].lower():
      booksToReturn.append(book)
  return booksToReturn

#is given array of books, returns an array of authors names that contain a certain string
def author(books, author):
  authorsToReturn = []
  for book in books:
    if author.lower() in book[2].lower() and book[2] not in authorsToReturn:
      authorsToReturn.append(book[2])
  return authorsToReturn

#gets all books published by an author
def printAuthorsBooks(books, authorName):
  booksToReturn = []
  for book in books:
    if book[2] == authorName:
      booksToReturn.append(book)
  return booksToReturn
      

  
#is given array of books and a range of years, and returns all books publihsed within those years, inclusive
def years(books, year1, year2):
  booksToReturn = []
  startYear = int(year1)
  endYear = int(year2)
  for book in books:
    if int(book[1]) >= startYear and int(book[1]) <= endYear:
      booksToReturn.append(book)
  return booksToReturn


def main():
  arguments = get_parsed_arguments()
  returnArray = []
  books = []
  file = open(arguments.file, newline='')
  reader = csv.reader(file)
  for row in reader:
    books.append(row)

  if arguments.book:
    print("Books that contain '" + arguments.book + "' in their title:")
    booksReturned = title(books, arguments.book)
    for book in booksReturned:
      print(book)
  if arguments.author:
    print("Authors (and their books) that contain '" + arguments.author + "' in their name:")
    authorsReturned = author(books, arguments.author)
    for authorz in authorsReturned:
      print(authorz + ":")
      booksReturned = printAuthorsBooks(books, authorz)
      i = 1
      for book in booksReturned:
        output = []
        for b in book:
          output.append(b)
        output.pop()
        print(str(i) + '.')
        print(output)
        i = i + 1
  if arguments.year1 or arguments.year2:
    year1 = arguments.year1
    year2 = arguments.year2
    datem = int(datetime.now().year) #makes it so it is always the current year it is being run
    if not year1:
      year1 = 0
    if not year2:
      year2 = datem
    print("Books that were made between: " + str(year1) + " and " + str(year2))
    yearsReturned = years(books, year1, year2)
    for year in yearsReturned:
      print(year)


  
if __name__ == "__main__":
    main()