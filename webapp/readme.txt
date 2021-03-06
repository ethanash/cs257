Here are things you must import to run our code:

pip install requests-oauthlib
pip install pyopenssl

We have a draft mode and a sandbox mode.
You can toggle between the two using the button in the bottom left
corner of the website. You can switch between formations using the
drop down menu on the left side of the website.
Here are the functional features of each mode:

Draft Mode: You can click on a position and it will give you
six players to choose from for that position. When you
click on one of them, they will be added to your team.

Sandbox Mode: We only have three filters to choose from right now.
You can pick the position, search by name, and search by club name.
You can combine any and all of these if you wish. The search
methods are not case sensitive. Nothing will happen if you click
on these players as we have not made it so that it will add them
to your team yet.

Additional Notes:
1) Goalies do NOT work right now. When you click on the goalie
position, 6 blank cards will show up.
2) Chemistry means nothing as of right now
(On the left side of the page)
3) You can use the URL to search through our database but will
receive JSON output. Here are possible searches:

https://localhost:5000/api/players

After this, here are a list of possible search arguments you can use
(S means the parameter takes a string, N means a number):

nationality (S)
league (S)
club (S)
shootinglow (N from 0 to 99)
shootinghigh (N from 0 to 99)
pacelow (N from 0 to 99)
pacehigh (N from 0 to 99)
dribblinglow (N from 0 to 99)
dribblinghigh (N from 0 to 99)
passinglow (N from 0 to 99)
passinghigh (N from 0 to 99)
defenselow (N from 0 to 99)
defensehigh (N from 0 to 99)
physicalitylow (N from 0 to 99)
physicalityhigh (N from 0 to 99)
overallratinglow (N from 0 to 99)
overallratinghigh (N from 0 to 99)
position (S - two letter abbreviation of a position like CB, RB, ST, CM, RW)
agelow (N from 0 to 99)
agehigh (N from 0 to 99)
name (S)

Examples:

https://localhost:5000/api/players?pacelow=85&club=chelsea

This will return all players on Chelsea who have a pace of at least 85.

https://localhost:5000/api/players?shootinghigh=76

This will return all players who have a shooting value less than 76.
