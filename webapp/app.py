#!/usr/bin/env python3
'''
    Ethan Ash & Riaz Kelly
'''
import sys
import argparse
import flask
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')

# Delivers the user to the site's home page.
@app.route('/')
def home():
    return flask.render_template('index.html')

# This route supports relative links among your web pages, assuming those pages
# are stored in the templates/ directory or one of its descendant directories,
# without requiring you to have specific routes for each page.

if __name__ == '__main__':
    parser = argparse.ArgumentParser('FIFA Draft Website')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)
