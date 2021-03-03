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
        element.onclick = draft;
    }
    changeFormation("4-3-3");
    makeClickable();
}

function makeClickable() {
    var inactiveCards = document.getElementsByClassName("inactive-card");
    for (var card of inactiveCards) {
        card.setAttribute("onclick", "onPositionDraft(this)");
    }
}

function onPositionDraft(obj) {
    if (obj){
        var position = obj.getAttribute("position");
        draft(position);
    }
    else {
        console.log("error");
    }
    
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function setInactiveCard(card){
    card.setAttribute("class", "inactive-card");
    htmlContents = "<div class='player-overall-rating'></div>" + 
                    "<div class='player-position'></div>" +
                    "<div class='player-nationality'></div>" +
                    "<div class='player-club'></div>" +
                    "<div class='player-name'></div>" +
                    "<div class='player-pace'></div>" +
                    "<div class='player-shooting'></div>" +
                    "<div class='player-passing'></div>" +
                    "<div class='player-dribbling'></div>" +
                    "<div class='player-defense'></div>" +
                    "<div class='player-physical'></div>" +
                    "<div class='player-league'></div>" +
                    "<img class='player-image' src='https://www.freeiconspng.com/uploads/plus-sign-icon-31.png'>";
    card.innerHTML = htmlContents;
}

function changeFormation(newFormation){
    console.log(newFormation)
    var playerField = document.getElementsByClassName("player-field")[0];
    var positions = playerField.children;

    if (newFormation == "4-4-2") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [1,3,5,6,8,9,10,11,13,14,17];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCard(position);
            }
            else {
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
            }
        }
    }
    else if (newFormation == "4-3-3") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [0,2,4,6,7,8,10,11,13,14,17];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCard(position);
            }
            else {
                position.removeAttribute("onclick")
                position.removeAttribute("class")
                position.innerHTML = "";
            }
        }
    }
    else if (newFormation == "4-5-1") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [2,5,6,7,8,9,10,11,13,14,17];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCard(position);
            }
            else {
                position.removeAttribute("onclick")
                position.removeAttribute("class")
                position.innerHTML = "";
            }
        }
    }
    makeClickable();
}

function draft(position) {
    var url = getAPIBaseURL() + '/players?position=' + position;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var playerListElement = document.getElementById('draft_selections');
        if(playerListElement){
            for (var i = 0; i < 6; i++) {
                var card = playerListElement.children[i];
                card.class = "active-card";
                var player = players[i];

                var positionDiv = card.getElementsByClassName("player-position")[0];
                var overallRatingDiv = card.getElementsByClassName("player-overall-rating")[0];
                // var nationalityDiv = card.getElementsByClassName("player-nationality")[0];
                // var clubDiv = card.getElementsByClassName("player-position")[0];
                var nameDiv = card.getElementsByClassName("player-name")[0];
                var paceDiv = card.getElementsByClassName("player-pace")[0];
                var shootingDiv = card.getElementsByClassName("player-shooting")[0];
                var passingDiv = card.getElementsByClassName("player-passing")[0];
                var dribblingDiv = card.getElementsByClassName("player-dribbling")[0];
                var defenseDiv = card.getElementsByClassName("player-defense")[0];
                var physicalDiv = card.getElementsByClassName("player-physical")[0];
                var playerImage = card.getElementsByClassName("player-image")[0];
                // var leagueDiv = card.getElementsByClassName("player-position")[0];

                positionDiv.innerHTML = player['position'].split(",")[0];
                overallRatingDiv.innerHTML = player['overall'];
                nameDiv.innerHTML = player['name'];
                paceDiv.innerHTML = player['pace'];
                shootingDiv.innerHTML = player['shooting'];
                passingDiv.innerHTML = player['passing'];
                dribblingDiv.innerHTML = player['dribbling'];
                defenseDiv.innerHTML = player['defense'];
                physicalDiv.innerHTML = player['physicality'];
                
                var sofifa_id = player["sofifa_id"].toString();
                while (sofifa_id.length < 6) {
                    sofifa_id = "0" + sofifa_id;
                }
                var idFirstHalf = sofifa_id.substring(0,3);
                var idSecondHalf = sofifa_id.substring(3,6);
                playerImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
                playerImage.onerror = "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';"
            }
        }  
    })

    .catch(function(error) {
        console.log(error);
    });
}

