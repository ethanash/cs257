/*
 * webapp.js
 * Ethan Ash and Riaz Kelly
 *
 * Preliminary Javascript to get 6 drafted players
 */

window.onload = initialize;

function initialize() {
    var element = document.getElementById('draft_button');
    if (element) {
        element.onclick = onDraftButton;
    }
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function onDraftButton() {
    var url = getAPIBaseURL() + '/players';
    console.log(url)
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var listBody = '';
        for (var i = 0; i < 6; i++) {
            var player = players[i];
            listBody += '<li>' + player['name']
                      + ', shooting: ' + player['shooting']
                      + ', dribbling: ' + player['dribbling']
                      + ', pace: ' + player['pace']
                      + ', defense: ' + player['defense']
                      + ', passing: ' + player['passing']
                      + ', nationality: ' + player['nationality']
                      + ', club: ' + player['club'];
                      + '</li>\n';
        }

        var playerListElement = document.getElementById('players_list');
        if (playerListElement) {
            playerListElement.innerHTML = listBody;
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}

