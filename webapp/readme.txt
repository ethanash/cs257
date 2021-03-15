AUTHORS: Ethan Ash & Riaz Kelly

DATA: All normal player cards from FIFA 21.

We downloaded our data through Kaggle and SoFifa. We got the raw
player stats from Kaggle and the player pictures from SoFifa.
https://www.kaggle.com/stefanoleone992/fifa-21-complete-player-dataset

STATUS: What's Working:

––You can draft random players on draft mode
––You can search for players on sandbox mode
––You can hover over a player card to display more stats
––You can create new teams, delete teams, and change a team's name
––Your team's average rating is displayed on the left side

What's Not Working:

––We don't have as many search filters as we would have liked
(such as age, weak foot, and skill moves)
––We never finished the chemistry of a team

NOTES:

NEEDED IN ORDER TO RUN OUR CODE:

    Please install these pip commands:

    pip install requests-oauthlib
    pip install pyopenssl

    Please put this in your config file:

    //////
    from oauthlib.oauth2 import WebApplicationClient
    import os

    # Change these values as appropriate for your postgresql setup.
    database = ''
    user = ''
    password = ''

    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24)

    GOOGLE_CLIENT_ID = "900631144036-ml0eakqmhkk8039e86mpdlcs6l784uui.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "HXTvm8Qmn6Im5zoQ0WBN41Mx"
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )

    # OAuth 2 client setup
    CLIENT_ = WebApplicationClient(GOOGLE_CLIENT_ID)
    //////

Last Note:

We both thought this project was a lot of fun! It was
undoubtedly a lot of work as well. We definitely had higher hopes,
or at least a more ambitious picture of our website until we found
out how many little details you have to add to make a website.
