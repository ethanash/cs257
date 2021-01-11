import argparse

def get_parsed_arguments():
    parser = argparse.ArgumentParser(description='Sort/filter a CSV formatted list of books and authors')
    parser.add_argument('animals', metavar='animal', nargs='+', help='one or more animals whose noises you seek')
    parser.add_argument('--language', '-l', default='english', help='the language in which the noises will be reported')
    parsed_arguments = parser.parse_args()
    return parsed_arguments