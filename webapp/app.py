#!/usr/bin/env python3
'''
    Ethan Ash & Riaz Kelly
'''
import sys
import argparse
import flask
import api
import json
import requests
from flask import render_template, redirect, request, make_response
from uuid import uuid4

import config
from config import GOOGLE_CLIENT_ID 
from config import GOOGLE_CLIENT_SECRET 
from config import GOOGLE_DISCOVERY_URL
from config import CLIENT_

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')

tokens = dict()
user_first_name = []
user_last_name = ''
user_email = ''

# Delivers the user to the site's home page.
@app.route('/draft')
@app.route('/')
def draft():
    token = request.cookies.get('sessionToken')
    if token in tokens:
        return flask.render_template('draft.html', user_first_name=user_first_name[0])
    return redirect('/login')

@app.route('/draftspecial')
def draftSpecial():
    user_first_name.append('')
    token = str(uuid4())
    tokens[token] = ''
    resp = make_response(redirect('/'))
    resp.set_cookie('sessionToken', token)
    return resp
    
@app.route('/sandbox')
def sandbox():
    token = request.cookies.get('sessionToken')
    if token in tokens:
        return flask.render_template('sandbox.html', user_first_name=user_first_name[0])
    return redirect('/login')

# This route supports relative links among your web pages, assuming those pages
# are stored in the templates/ directory or one of its descendant directories,
# without requiring you to have specific routes for each page.
@app.route('/<path:path>')
def shared_header_catchall(path):
    return flask.render_template(path)

@app.route('/login')
def login():
    token = request.cookies.get('sessionToken')
    if token in tokens:
        return redirect('/')
    return flask.render_template('login.html')

@app.route('/login', methods=['POST'])
def loginPost():
    # gets the URL we need for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # construct request for Google login including arguments to get the user's profile
    request_uri = CLIENT_.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@app.route('/login/callback')
def loginCallback():
    '''
        Dealing with return response form google login
    '''
    # get authorization code google sends back
    code = request.args.get("code")

    # get the url we need to send the authorization code back to google
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # getting ready to send a request for the tokens I want
    token_url, headers, body = CLIENT_.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    # sending post request to get tokens
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # parsing received tokens
    CLIENT_.parse_request_body_response(json.dumps(token_response.json()))

    # getting user info from google
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = CLIENT_.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # gets the user info and check to make sure their email is verified
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_firstName = userinfo_response.json()["given_name"]
        users_lastName = userinfo_response.json()["family_name"]

        #if already assigned to role by admin

        #make cookie for them
        token = str(uuid4())
        tokens[token] = users_email
        resp = make_response(redirect('/'))
        resp.set_cookie('sessionToken', token)
        return resp
    else:
        # their email is not verified
        # TO-DO add login failed message
        return redirect('/login')

@app.route('/logout')
def logOut():
    #deletes cookie and redirects to login page
    token = request.cookies.get('sessionToken')
    if token in tokens:
        del tokens[token]
    user_first_name = []
    user_last_name = ''
    user_email = ''
    return redirect('/login')


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

if __name__ == '__main__':
    parser = argparse.ArgumentParser('FIFA Draft Website')
    parser.add_argument('host', help='the host on which this application is running')
    parser.add_argument('port', type=int, help='the port on which this application is listening')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True, ssl_context='adhoc')
