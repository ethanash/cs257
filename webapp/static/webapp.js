/*
 * webapp.js
 * Ethan Ash and Riaz Kelly
 *
 * Preliminary Javascript to get 6 drafted players
 */

window.onload = initialize;
var isDraft;
var continueFunc = true;

function initialize() {
    if (location.href.split("/").slice(-1)[0] !== "sandbox") {
        isDraft = true;
        fillInTeamSelector();
        setFormation("4-3-3");
        makeClickable();
    }
    else {
        isDraft = false;
        setFormation("4-3-3");
        fillInPositionSelector();
    }

}

function fillInTeamSelector() {
    var url = getAPIBaseURL() + '/accountteams';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(teams) {
        var teamSelector = document.getElementById("teamSelector");
        var innerHTML = '<option selected disabled>Select Team</option>';
        for(var team of teams){
            innerHTML = innerHTML + '<option value="' + team["id"] + '">' + team["name"] + '</option>';
        }
        teamSelector.innerHTML = innerHTML;
    })
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

function createNewTeam(){
    var url = getAPIBaseURL() + '/createteam';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(teams) {
        var teamId;
        var teamName;
        for (var team of teams){
            teamId = team["id"];
            teamName = team["name"];
        }
        setTeam(teamId, teamName);
        fillInTeamSelector();
        continueFunc = true;
        console.log("done")
    })
}

function changeTeam(teamId){
    var teamName;
    var selectOptions = document.getElementById("teamSelector").children;
    console.log(selectOptions);
    for (var option of selectOptions){
        if (option.value == teamId){
            teamName = option.innerHTML;
            break;
        }
    }
    resetField();
    setTeam(teamId, teamName);
    displayTeam();
}

function resetField(){
    var currFormation = document.getElementById("currentFormation");
    setFormation(currFormation.getAttribute("value"));
}

function changeTeamName(){
    var newNameInput = document.getElementById("new-team-name");
    var newName = newNameInput.value;
    continueFunc = false;
    if (!getTeamId()){
        console.log("ok then?");
        createNewTeam();
    }else{
        continueFunc = true;
    }
    waitForIt();
    function waitForIt(){
        if (!continueFunc) {
            setTimeout(function(){waitForIt()},100);
        }else {
            console.log("team id");
            console.log(getTeamId());
            var url = getAPIBaseURL() + '/changeteamname?teamid=' + getTeamId() + '&name=' + newName;
            console.log(url);
            fetch(url, {method: 'get'})

            .then((response) => response.json())

            .then(function(teams) {
                var teamId;
                var teamName;
                for (var team of teams){
                    teamId = team["id"];
                    teamName = team["name"]
                }
                fillInTeamSelector();
                setTeam(teamId, teamName);
            })
        }
    }

}

function getTeamId(){
    var teamIdForm = document.getElementById("teamId");
    console.log(teamIdForm);
    return teamIdForm.getAttribute("value");
}

function setTeam(newId, newName){
    var teamIdForm = document.getElementById("teamId");
    teamIdForm.setAttribute("value", newId);
    teamIdForm.setAttribute("teamname", newName);

    var teamNameInput = document.getElementById("new-team-name");
    teamNameInput.value = newName;

    var newNameForm = document.getElementById("new-team-name");
    newNameForm.setAttribute("value", newName);
}

function resetTeam(){
    var teamIdForm = document.getElementById("teamId");
    teamIdForm.setAttribute("value", "");
    teamIdForm.setAttribute("teamname", "");

    var newNameForm = document.getElementById("new-team-name");
    newNameForm.setAttribute("value", "New Draft");

    var ratingDiv = document.getElementById("team-average-rating");
    ratingDiv.innerHTML = "";
}

function addPlayerToTeam(playerId, playerlocation){
    var url = getAPIBaseURL() + '/addplayer?playerid=' + playerId + '&teamid=' + getTeamId() + '&playerlocation=' + playerlocation;
    console.log(url);
    fetch(url, {method: 'get'});
}

function displayTeam(){
    var playerField = document.getElementsByClassName("player-field")[0];

    var url = getAPIBaseURL() + '/teamplayers?teamid=' + getTeamId();
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var sum = 0
        var total = 0
        for (var player of players){
            // if (player['name'] == 'NO DATA'){
            //     return;
            // }
            var query = '[positionindex="' + player["location"] + '"]'
            var fieldLocation = playerField.querySelectorAll(query)[0];

            if(fieldLocation.getAttribute("class") == "inactive-card"){
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
                for (var pos of positionsPlayed) {
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

                fieldLocation.setAttribute("playerid", player["player_id"]);
            }
            else{
                sum = sum + player["overall"];
                total = total + 1;
                var teamAverageRating = document.getElementById("team-average-rating");
                teamAverageRating.innerHTML = Math.round(sum/total);
            }
        }

        var playerListElement = document.getElementById('draft-selections');
        playerListElement.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div>";

        makeActiveNotClickable();
        makeClickable();
    })
}

function deleteTeam(){
    var url = getAPIBaseURL() + '/deleteteam?teamid=' + getTeamId();
    console.log(url);
    fetch(url, {method: 'get'})

    resetTeam()

    fillInTeamSelector();
    setFormation("4-3-3");
    makeClickable()
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

    var storeFormation = document.getElementById("currentFormation");
    storeFormation.setAttribute("value", newFormation);

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

'''––––––––––––––––––––––––––– Draft Functions –––––––––––––––––––––––––––'''

function onPositionDraft(obj) {
    var position = obj.getAttribute("position");
    var positionIndex = obj.getAttribute("positionindex")
    if (position.equals("GK")) {
        goalieDraft(position, positionIndex);
    }
    else {
        draft(position, positionIndex);
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

function draft(position, positionIndex) {

    createDraftCards(position);

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
                for (var pos of positionsPlayed) {
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

                card.setAttribute("playerid", player["player_id"]);
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

    createDraftCards(position);

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

function makeSelectionsClickable() {
    var playerListElement = document.getElementById('draft-selections');
    selections = playerListElement.children;
    for (var selection of selections) {
        selection.setAttribute("onclick", "onDraftSelection(this)");
    }
}

function onDraftSelection(obj){
    var playerId = obj.getAttribute("playerid");
    var positionIndex = obj.getAttribute("positionindex");

    if (getTeamId() == "")
    createNewTeam();

    addPlayerToTeam(playerId, positionIndex);
    displayTeam();
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
        var overallRatingDiv = fieldLocation.getElementsByClassName("player-overall-rating")[0];
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

        positionDiv.innerHTML = goalie['position'];
        overallRatingDiv.innerHTML = goalie['overall'];
        nameDiv.innerHTML = goalie['name'];
        divingDiv.innerHTML = goalie['diving'];
        reflexesDiv.innerHTML = goalie['reflexes'];
        handlingDiv.innerHTML = goalie['handling'];
        kickingDiv.innerHTML = goalie['kicking'];
        positioningDiv.innerHTML = goalie['positioning'];
        speedDiv.innerHTML = goalie['speed'];

        sum = sum + goalie['overall'];
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

'''––––––––––––––––––––––––––– Search Functions –––––––––––––––––––––––––––'''

function playerSearch(event){
    event.preventDefault();
    var position = event.target.elements.position.value;
    var name = event.target.elements.name.value;
    var club = event.target.elements.club.value;

    if(position = 'GK'){
        goalieSearch(event);
    }

    else {
        createSearchCards(position);

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
                    for (var pos of positionsPlayed) {
                        if (pos.replace(/\s/g, '') == position.replace(/\s/g, '')) {
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

                    card.setAttribute("playerid", player["player_id"]);
                }
            }
        })

        .catch(function(error) {
            console.log(error);
        });
    }

}

function goalieSearch(event){
    event.preventDefault();
    var position = event.target.elements.position.value;
    var name = event.target.elements.name.value;
    var club = event.target.elements.club.value;

    createSearchCards(position);

    var url = getAPIBaseURL() + '/goalies?name=' + name + '&club=' + club + '&position=' + position;
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
                positionDiv.innerHTML = goalie['position'];
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

                card.setAttribute("playerid", sofifa_id);
            }
        }
    })

    .catch(function(error) {
        console.log(error);
    });

}

function createSearchCards(position){
    var searchSelections = document.getElementById("searched-players");
    if (!(searchSelections.firstChild.firstChild)) {
        var cardSlots = searchSelections.children;
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
