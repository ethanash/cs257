/*
 * webapp.js
 * Ethan Ash and Riaz Kelly
 *
 * Preliminary Javascript to get 6 drafted players
 */

window.onload = initialize;
var isDraft;
var total = 0;
var sum = 0;

function initialize() {
    if (location.href.split("/").slice(-1)[0] !== "sandbox") {
        isDraft = true;
        setFormation("4-3-3");
        makeClickable();
    }
    else {
        isDraft = false;
        setFormation("4-3-3");
        fillInPositionSelector();
    }

}

function fillInPositionSelector(){
    var positionSelector = document.getElementById("positionSelector");
    var playerField = document.getElementsByClassName("player-field")[0];
    var innerHTML = "";
    for (var card of playerField.children) {
        var className = card.getAttribute("class");
        if (className == "inactive-card") {
            var position = card.getAttribute("position");
            innerHTML = innerHTML + '<option value="' + position + '">' + position + '</option>';
        }
    }
    positionSelector.innerHTML = innerHTML;
}

function makeClickable() {
    var inactiveCards = document.getElementsByClassName("inactive-card");
    for (var card of inactiveCards) {
        card.setAttribute("onclick", "onPositionDraft(this)");
    }
}

function makeNotClickable() {
    var inactiveCards = document.getElementsByClassName("inactive-card");
    for (var card of inactiveCards) {
        card.removeAttribute("onclick");
    }
}

function makeActiveNotClickable() {
    var playerField = document.getElementsByClassName("player-field")[0];
    for (var card of playerField.children) {
        if (card.getAttribute("class") == "active-card") {
            card.removeAttribute("onclick")
        }
    }
}

function onPositionDraft(obj) {
    var position = obj.getAttribute("position");
    var positionIndex = obj.getAttribute("positionindex")
    draft(position, positionIndex);
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function setInactiveCardField(card){
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

function setInactiveCardSelection(card){
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
                    "<img class='player-image' src=''>";
    card.innerHTML = htmlContents;
}

function setInactiveGoalieCard(card){
    card.setAttribute("class", "inactive-card");
    htmlContents = "<div class='player-overall-rating'></div>" +
                    "<div class='player-position'></div>" +
                    "<div class='player-nationality'></div>" +
                    "<div class='player-club'></div>" +
                    "<div class='player-name'></div>" +
                    "<div class='goalie-diving'></div>" +
                    "<div class='goalie-reflexes'></div>" +
                    "<div class='goalie-handling'></div>" +
                    "<div class='goalie-kicking'></div>" +
                    "<div class='goalie-speed'></div>" +
                    "<div class='goalie-positioning'></div>" +
                    "<div class='player-league'></div>" +
                    "<img class='player-image' src=''>";
    card.innerHTML = htmlContents;
}

function setFormation(newFormation){
    console.log(newFormation)
    var playerField = document.getElementsByClassName("player-field")[0];
    var positions = playerField.children;

    if (newFormation == "4-4-2") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [1,3,5,6,8,9,10,11,13,14,16];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCardField(position);
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
            var formationPositions = [0,2,4,6,7,8,10,11,13,14,16];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCardField(position);
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
            var formationPositions = [2,5,6,7,8,9,10,11,13,14,16];
            if(formationPositions.includes(i)){
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
                setInactiveCardField(position);
            }
            else {
                position.removeAttribute("onclick");
                position.removeAttribute("class");
                position.innerHTML = "";
            }
        }
    }
    if (!isDraft) {
        fillInPositionSelector();
    }
}

function createDraftCards(position){
    var draftSelections = document.getElementById("draft-selections");
    if (!(draftSelections.firstChild.firstChild)) {
        var cardSlots = draftSelections.children;
        for (card of cardSlots){
            if (position != 'GK'){
                setInactiveCardSelection(card);
            }
            else {
                setInactiveGoalieCard(card);
            }
        }
    }
}

function createSearchCards(){
    var draftSelections = document.getElementById("searched-players");
    if (!(draftSelections.firstChild.firstChild)) {
        var cardSlots = draftSelections.children;
        for (card of cardSlots){
            if (position != 'GK'){
                setInactiveCardSelection(card);
            }
            else {
                setInactiveGoalieCard(card);
            }
        }
    }
}

function draft(position, positionIndex) {
    createDraftCards(position);

    if (positionIndex == 16){
        goalieDraft(position, positionIndex);
        return;
    }

    var url = getAPIBaseURL() + '/players?position=' + position;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var playerListElement = document.getElementById('draft-selections');
        if(playerListElement){
            for (var i = 0; i < 6; i++) {
                var card = playerListElement.children[i];
                card.setAttribute("class", "active-card");
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

                var positionsPlayed = player['position'].split(",");
                var relevantPosition = positionsPlayed[0];
                for (pos of positionsPlayed) {
                    if (pos == position) {
                        relevantPosition = pos;
                    }
                }
                positionDiv.innerHTML = relevantPosition;
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
                playerImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

                card.setAttribute("playerid", sofifa_id);
                card.setAttribute("positionindex", positionIndex);

                makeNotClickable();
                makeSelectionsClickable();
            }
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}

function goalieDraft(position, positionIndex) {
    var url = getAPIBaseURL() + '/goalies';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(goalies) {
        var goalieListElement = document.getElementById('draft-selections');
        if(goalieListElement){
            for (var i = 0; i < 6; i++) {
                var card = goalieListElement.children[i];
                card.setAttribute("class", "active-card");
                var goalie = goalies[i];

                var overallRatingDiv = card.getElementsByClassName("player-overall-rating")[0];
                // var nationalityDiv = card.getElementsByClassName("goalie-nationality")[0];
                // var clubDiv = card.getElementsByClassName("goalie-position")[0];
                var nameDiv = card.getElementsByClassName("player-name")[0];
                var divingDiv = card.getElementsByClassName("goalie-diving")[0];
                var reflexesDiv = card.getElementsByClassName("goalie-reflexes")[0];
                var handlingDiv = card.getElementsByClassName("goalie-handling")[0];
                var kickingDiv = card.getElementsByClassName("goalie-kicking")[0];
                var speedDiv = card.getElementsByClassName("goalie-speed")[0];
                var positioningDiv = card.getElementsByClassName("goalie-positioning")[0];
                var goalieImage = card.getElementsByClassName("player-image")[0];
                // var leagueDiv = card.getElementsByClassName("goalie-position")[0];

                positionDiv.innerHTML = 'GK';
                overallRatingDiv.innerHTML = goalie['overall'];
                nameDiv.innerHTML = goalie['name'];
                divingDiv.innerHTML = goalie['diving'];
                reflexesDiv.innerHTML = goalie['reflexes'];
                handlingDiv.innerHTML = goalie['handling'];
                kickingDiv.innerHTML = goalie['kicking'];
                speedDiv.innerHTML = goalie['speed'];
                positioningDiv.innerHTML = goalie['positioning'];

                var sofifa_id = goalie["sofifa_id"].toString();
                while (sofifa_id.length < 6) {
                    sofifa_id = "0" + sofifa_id;
                }
                var idFirstHalf = sofifa_id.substring(0,3);
                var idSecondHalf = sofifa_id.substring(3,6);
                goalieImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
                goalieImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

                card.setAttribute("goalieid", sofifa_id);
                card.setAttribute("positionindex", positionIndex);

                makeNotClickable();
                makeSelectionsClickable();
            }
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}

function makeSelectionsClickable() {
    var playerListElement = document.getElementById('draft-selections');
    selections = playerListElement.children;
    for (selection of selections) {
        selection.setAttribute("onclick", "onDraftSelection(this)");
    }
}

function onDraftSelection(obj) {
    var sofifa_id = obj.getAttribute("playerid");
    var positionIndex = obj.getAttribute("positionindex");

    if (positionIndex = 16){
        onDraftSelectionGoalie(obj);
        break;
    }

    var playerField = document.getElementsByClassName("player-field")[0];
    var query = '[positionindex="' + positionIndex + '"]'
    var fieldLocation = playerField.querySelectorAll(query)[0];

    var url = getAPIBaseURL() + '/players?sofifa_id=' + sofifa_id;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        player = players[0];
        fieldLocation.setAttribute("class", "active-card");
        var positionDiv = fieldLocation.getElementsByClassName("player-position")[0];
        var overallRatingDiv = fieldLocation.getElementsByClassName("player-overall-rating")[0];
        // var nationalityDiv = fieldLocation.getElementsByClassName("player-nationality")[0];
        // var clubDiv = fieldLocation.getElementsByClassName("player-position")[0];
        var nameDiv = fieldLocation.getElementsByClassName("player-name")[0];
        var paceDiv = fieldLocation.getElementsByClassName("player-pace")[0];
        var shootingDiv = fieldLocation.getElementsByClassName("player-shooting")[0];
        var passingDiv = fieldLocation.getElementsByClassName("player-passing")[0];
        var dribblingDiv = fieldLocation.getElementsByClassName("player-dribbling")[0];
        var defenseDiv = fieldLocation.getElementsByClassName("player-defense")[0];
        var physicalDiv = fieldLocation.getElementsByClassName("player-physical")[0];
        var playerImage = fieldLocation.getElementsByClassName("player-image")[0];
        // var leagueDiv = fieldLocation.getElementsByClassName("player-position")[0];

        positionsPlayed = player['position'].split(",");
        relevantPosition = positionsPlayed[0];
        for (pos of positionsPlayed) {
            if (pos == fieldLocation.getAttribute("position")) {
                relevantPosition = pos;
            }
        }
        positionDiv.innerHTML = relevantPosition;
        overallRatingDiv.innerHTML = player['overall'];
        nameDiv.innerHTML = player['name'];
        paceDiv.innerHTML = player['pace'];
        shootingDiv.innerHTML = player['shooting'];
        passingDiv.innerHTML = player['passing'];
        dribblingDiv.innerHTML = player['dribbling'];
        defenseDiv.innerHTML = player['defense'];
        physicalDiv.innerHTML = player['physicality'];

        sum = sum + player["overall"];
        total = total + 1;
        var teamAverageRating = document.getElementById("team-average-rating");
        teamAverageRating.innerHTML = sum/total;

        var sofifa_id = player["sofifa_id"].toString();
        while (sofifa_id.length < 6) {
            sofifa_id = "0" + sofifa_id;
        }
        var idFirstHalf = sofifa_id.substring(0,3);
        var idSecondHalf = sofifa_id.substring(3,6);
        playerImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
        playerImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

        fieldLocation.setAttribute("playerid", sofifa_id);

        var playerListElement = document.getElementById('draft-selections');
        playerListElement.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div>";

        makeActiveNotClickable();
        makeClickable();
    })

}

function onDraftSelectionGoalie(obj) {
    var sofifa_id = obj.getAttribute("goalieid");
    var positionIndex = obj.getAttribute("positionindex");

    var playerField = document.getElementsByClassName("player-field")[0];
    var query = '[positionindex="' + positionIndex + '"]'
    var fieldLocation = playerField.querySelectorAll(query)[0];

    var url = getAPIBaseURL() + '/goalies?sofifa_id=' + sofifa_id;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(goalies) {
        goalie = goalies[0];
        fieldLocation.setAttribute("class", "active-card");
        var overallRatingDiv = fieldLocation.getElementsByClassName("goalie-overall-rating")[0];
        // var nationalityDiv = fieldLocation.getElementsByClassName("goalie-nationality")[0];
        // var clubDiv = fieldLocation.getElementsByClassName("goalie-position")[0];
        var nameDiv = fieldLocation.getElementsByClassName("player-name")[0];
        var divingDiv = fieldLocation.getElementsByClassName("goalie-diving")[0];
        var reflexesDiv = fieldLocation.getElementsByClassName("goalie-reflexes")[0];
        var handlingDiv = fieldLocation.getElementsByClassName("goalie-handling")[0];
        var kickingDiv = fieldLocation.getElementsByClassName("goalie-kicking")[0];
        var positioningDiv = fieldLocation.getElementsByClassName("goalie-positioning")[0];
        var speedDiv = fieldLocation.getElementsByClassName("goalie-speed")[0];
        var goalieImage = fieldLocation.getElementsByClassName("player-image")[0];
        // var leagueDiv = fieldLocation.getElementsByClassName("goalie-position")[0];

        positionDiv.innerHTML = 'GK';
        overallRatingDiv.innerHTML = goalie['overall'];
        nameDiv.innerHTML = goalie['name'];
        divingDiv.innerHTML = goalie['diving'];
        reflexesDiv.innerHTML = goalie['reflexes'];
        handlingDiv.innerHTML = goalie['handling'];
        kickingDiv.innerHTML = goalie['kicking'];
        positioningDiv.innerHTML = goalie['positioning'];
        speedDiv.innerHTML = goalie['speed'];

        sum = sum + goalie["overall"];
        total = total + 1;
        var teamAverageRating = document.getElementById("team-average-rating");
        teamAverageRating.innerHTML = sum/total;

        var sofifa_id = goalie["sofifa_id"].toString();
        while (sofifa_id.length < 6) {
            sofifa_id = "0" + sofifa_id;
        }
        var idFirstHalf = sofifa_id.substring(0,3);
        var idSecondHalf = sofifa_id.substring(3,6);
        goalieImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
        goalieImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

        fieldLocation.setAttribute("playerid", sofifa_id);

        var goalieListElement = document.getElementById('draft-selections');
        goalieListElement.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div>";

        makeActiveNotClickable();
        makeClickable();
    })

}

function playerSearch(event){
    event.preventDefault();
    var position = event.target.elements.position.value;
    var name = event.target.elements.name.value;
    var club = event.target.elements.club.value;

    createSearchCards();

    if(position = 'GK'){
        goalieSearch(event);
        return;
    }

    var url = getAPIBaseURL() + '/players?name=' + name + '&club=' + club+ '&position=' + position;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var playerListElement = document.getElementById('searched-players');
        if(playerListElement){
            for (var i = 0; i < players.length; i++) {
                var card = playerListElement.children[i];
                card.setAttribute("class", "active-card");
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

                var positionsPlayed = player['position'].split(",");
                var relevantPosition = positionsPlayed[0];
                for (pos of positionsPlayed) {
                    console.log(pos);
                    console.log(position);
                    if (pos.replace(/\s/g, '') == position.replace(/\s/g, '')) {
                        relevantPosition = pos;
                    }
                }
                console.log("---")
                positionDiv.innerHTML = relevantPosition;
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
                playerImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

                card.setAttribute("playerid", sofifa_id);
            }
        }
    })

    .catch(function(error) {
        console.log(error);
    });

}

function goalieSearch(event){
    event.preventDefault();
    var position = 'GK';
    var name = event.target.elements.name.value;
    var club = event.target.elements.club.value;

    var url = getAPIBaseURL() + '/goalie?name=' + name + '&club=' + club + '&position=' + position;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(goalies) {
        var goalieListElement = document.getElementById('searched-players');
        if(goalieListElement){
            for (var i = 0; i < goalies.length; i++) {
                var card = goalieListElement.children[i];
                card.setAttribute("class", "active-card");
                var goalie = goalies[i];

                var overallRatingDiv = card.getElementsByClassName("player-overall-rating")[0];
                // var nationalityDiv = card.getElementsByClassName("player-nationality")[0];
                // var clubDiv = card.getElementsByClassName("player-position")[0];
                var nameDiv = card.getElementsByClassName("player-name")[0];
                var divingDiv = card.getElementsByClassName("goalie-diving")[0];
                var reflexesDiv = card.getElementsByClassName("goalie-reflexes")[0];
                var handlingDiv = card.getElementsByClassName("goalie-handling")[0];
                var kickingDiv = card.getElementsByClassName("goalie-kicking")[0];
                var speedDiv = card.getElementsByClassName("goalie-speed")[0];
                var positioningDiv = card.getElementsByClassName("goalie-positioning")[0];
                var goalieImage = card.getElementsByClassName("player-image")[0];
                // var leagueDiv = card.getElementsByClassName("player-position")[0];

                console.log("---")
                positionDiv.innerHTML = 'GK';
                overallRatingDiv.innerHTML = goalie['overall'];
                nameDiv.innerHTML = goalie['name'];
                divingDiv.innerHTML = goalie['diving'];
                reflexesDiv.innerHTML = goalie['reflexes'];
                handlingDiv.innerHTML = goalie['handling'];
                kickingDiv.innerHTML = goalie['kicking'];
                speedDiv.innerHTML = goalie['speed'];
                positioningDiv.innerHTML = goalie['positioning'];

                var sofifa_id = goalie["sofifa_id"].toString();
                while (sofifa_id.length < 6) {
                    sofifa_id = "0" + sofifa_id;
                }
                var idFirstHalf = sofifa_id.substring(0,3);
                var idSecondHalf = sofifa_id.substring(3,6);
                goalieImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
                goalieImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

                card.setAttribute("goalieid", sofifa_id);
            }
        }
    })

    .catch(function(error) {
        console.log(error);
    });

}
