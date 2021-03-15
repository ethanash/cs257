/*
 * webapp.js
 * Ethan Ash and Riaz Kelly
 *
 * Preliminary Javascript to get 6 drafted players
 */

window.onload = initialize;
var isDraft;
var continueFunc = true;
var continueFunc2 = true;
var continueFunc3 = true;

// function setHover() {
//     var activePlayerCards = document.getElementsByClassName("active-card");
//     for (var card of activePlayerCards) {
//         card.setAttribute("onmouseover", displayStats(this));
//     }
//     var activeGoalieCards = document.getElementsByClassName("active-goalie-card");
//     for (var card of activeGoalieCards) {
//         card.setAttribute("onmouseover", displayGoalieStats(this));
//     }
// }
// function league_list_creator(elements) {
//     var list = document
//     for (element in elements) {
//
//     }
// }
function searchPreferredFeet() {
    var feet = ["Right", "Left"];

    for (var foot in feet) {
        var optionElement = document.createElement("option");
        optionElement.value = feet[foot];
        document.getElementById("feet").appendChild(optionElement);
  }
}

function searchLeagues() {
    var league_array = [];

    var url = getAPIBaseURL() + '/leagues';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(leagues) {
        for (var league of leagues) {
            var league_name = league['league'];
            league_array.push(league_name);
        }
        for (var league in league_array) {
            var optionElement = document.createElement("option");
            optionElement.value = league_array[league];
            document.getElementById("leagues").appendChild(optionElement);
        }
    })
    .catch(function(error) {
    console.log(error);
    });
}

function searchClubs() {
    var club_array = [];

    var url = getAPIBaseURL() + '/clubs';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(clubs) {
        for (var club of clubs) {
            var club_name = club['club'];
            club_array.push(club_name);
        }
        for (var club in club_array) {
            var optionElement = document.createElement("option");
            optionElement.value = club_array[club];
            document.getElementById("clubs").appendChild(optionElement);
        }
    })
    .catch(function(error) {
    console.log(error);
    });
}

function searchNationalities() {
    var nationality_array = [];

    var url = getAPIBaseURL() + '/nationalities';
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(nationalities) {
        for (var nationality of nationalities) {
            var nationality_name = nationality['nationality'];
            nationality_array.push(nationality_name);
        }
        for (var nationality in nationality_array) {
            var optionElement = document.createElement("option");
            optionElement.value = nationality_array[nationality];
            document.getElementById("nationalities").appendChild(optionElement);
        }
    })
    .catch(function(error) {
    console.log(error);
    });
}

function displayPlayerStats(card, player) {
    var displayPlayerStats = card.getElementById('displayPlayerStats')[0];
    // var nationalityDiv = card.getElementsByClassName("hide")[0];
    // var leagueDiv = card.getElementsByClassName("player-league")[0];
    // var clubDiv = card.getElementsByClassName("player-club")[0];
    // var weakFootDiv = card.getElementsByClassName("player-weak-foot")[0];
    // var skillMovesDiv = card.getElementsByClassName("player-skill-moves")[0];
    // var preferredFootDiv = card.getElementsByClassName("player-preferred-foot")[0];
    // var ageDiv = card.getElementsByClassName("player-age")[0];

    stats.innerHTML = player['nationality'] + player['league'] + player['club'] + String(player['weak_foot'])
    + String(player['skill_moves']) + player['preferred_foot'] + player['age'];
}

// function displayGoalieStats(card) {
//     var nationalityDiv = card.getElementsByClassName("player-nationality")[0];
//     var leagueDiv = card.getElementsByClassName("player-league")[0];
//     var clubDiv = card.getElementsByClassName("player-club")[0];
//     var weakFootDiv = card.getElementsByClassName("player-weak-foot")[0];
//     var preferredFootDiv = card.getElementsByClassName("player-preferred-foot")[0];
// }

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
        searchLeagues();
        searchClubs();
        searchNationalities();
        searchPreferredFeet();
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
        continueFunc2 = true;
    })
}

function fillInPositionSelector(){
    var positionSelector = document.getElementById("positionSelector");
    var playerField = document.getElementsByClassName("player-field")[0];
    var innerHTML = "";
    for (var card of playerField.children) {
        var className = card.getAttribute("class");
        if (className == "inactive-card" || className =='inactive-goalie-card') {
            var position = card.getAttribute("position");
            innerHTML = innerHTML + '<option value="' + position + '">' + position + '</option>';
        }

    }
    positionSelector.innerHTML = innerHTML;
}

function createNewTeam(){
    var formation = document.getElementById("formations").value;
    var url = getAPIBaseURL() + '/createteam/' + formation;
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
        continueFunc2 = false;
        fillInTeamSelector();
        waitForIt();
        function waitForIt(){
            if (!continueFunc2) {
                setTimeout(function(){waitForIt()},100);
            }else {
                continueFunc3 = false;
                setTeam(teamId, teamName);
                waitForItAgain();
                function waitForItAgain(){
                    if (!continueFunc3) {
                        setTimeout(function(){waitForItAgain()},100);
                    }else {
                        continueFunc = true;
                    }
                }
            }
        }
    })
}

function changeTeam(teamId){
    var teamName;
    var selectOptions = document.getElementById("teamSelector").children;
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
    var playerField = document.getElementsByClassName("player-field")[0];
    var positions = playerField.children;

    for (var i = 0; i < positions.length; i ++) {
        var position = positions[i];
        position.removeAttribute("onclick");
        position.removeAttribute("class");
        position.innerHTML = "";
    }
}

function changeTeamName(){
    var newNameInput = document.getElementById("new-team-name");
    var newName = newNameInput.value;
    continueFunc = false;
    if (!getTeamId()){
        createNewTeam();
    }else{
        continueFunc = true;
    }
    waitForIt();
    function waitForIt(){
        if (!continueFunc) {
            setTimeout(function(){waitForIt()},100);
        }else {
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
                continueFunc2 = false;
                fillInTeamSelector();
                waitForItAgain();
                function waitForItAgain(){
                    if (!continueFunc2) {
                        setTimeout(function(){waitForItAgain()},100);
                    }else {
                        setTeam(teamId, teamName);
                    }
                }
            })
        }
    }

}

function getTeamId(){
    var teamIdForm = document.getElementById("teamId");
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

    var teamsChoices = document.getElementById("teamSelector").children;
    for (team of teamsChoices){
        if (team.value == newId){
            team.selected = 'selected';
        }
    }
    console.log("done")
    continueFunc3 = true;
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

function addPlayerToTeam(playerId, playerLocation){
    var url;
    if (playerLocation == 17 || playerLocation == "17") {
        goalieId = playerId;
        url = getAPIBaseURL() + '/addgoalie?goalieid=' + goalieId + '&teamid=' + getTeamId();

    }
    else {
        url = getAPIBaseURL() + '/addplayer?playerid=' + playerId + '&teamid=' + getTeamId() + '&playerlocation=' + playerLocation;
    }
    console.log(url);
    fetch(url, {method: 'get'});
}

function displayTeam(){
    var rating = document.getElementById('team-average-rating');
    rating.innerHTML='';
    var playerField = document.getElementsByClassName("player-field")[0];

    var url = getAPIBaseURL() + '/teamplayers?teamid=' + getTeamId();
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(players) {
        var sum = 0;
        var total = 0;
        for (var player of players){
            if (player['formation']){
                setFormation(player['formation']);
                continue;
            }
            var query = '[positionindex="' + player["location"] + '"]'
            var fieldLocation = playerField.querySelectorAll(query)[0];
            var position = fieldLocation.getAttribute("position");

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
                var popup = fieldLocation.getElementsByClassName("popup")[0];

                var popupName = popup.getElementsByClassName("popupName")[0];
                popupName.innerHTML = player['name'];
                var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                popupNationality.innerHTML = "Nationality: " + player['nationality'];
                var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                popupLeague.innerHTML = "League: " + player['league'];
                var popupClub = popup.getElementsByClassName("popupClub")[0];
                popupClub.innerHTML = "Club: " + player['club'];
                var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                popupPreferredFoot.innerHTML = "Preferred Foot: " + player['preferred_foot'];
                var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                popupWeakFoot.innerHTML = "Weak Foot Ability: " + player['weak_foot'];
                var popupSkillMoves = popup.getElementsByClassName("popupSkillMoves")[0];
                popupSkillMoves.innerHTML = "Skill Moves: " + player['skill_moves'];

                // var leagueDiv = fieldLocation.getElementsByClassName("player-position")[0];

                // positionsPlayed = player['position'].split(",");
                // relevantPosition = positionsPlayed[0];
                // for (var pos of positionsPlayed) {
                //     if (pos == fieldLocation.getAttribute("position")) {
                //         relevantPosition = pos;
                //     }
                // }
                positionDiv.innerHTML = position;
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

        var url = getAPIBaseURL() + '/teamgoalies?teamid=' + getTeamId();
        console.log(url);
        fetch(url, {method: 'get'})

        .then((response) => response.json())

        .then(function(goalies) {
            for (var goalie of goalies){
                var query = '[positionindex="' + 17 + '"]'
                var fieldLocation = playerField.querySelectorAll(query)[0];

                if(fieldLocation.getAttribute("class") == "inactive-goalie-card"){
                    fieldLocation.setAttribute("class", "active-goalie-card");
                    var positionDiv = fieldLocation.getElementsByClassName("player-position")[0];
                    var overallRatingDiv = fieldLocation.getElementsByClassName("player-overall-rating")[0];
                    // var nationalityDiv = fieldLocation.getElementsByClassName("player-nationality")[0];
                    // var clubDiv = fieldLocation.getElementsByClassName("player-position")[0];
                    var nameDiv = fieldLocation.getElementsByClassName("goalie-name")[0];
                    var divingDiv = fieldLocation.getElementsByClassName("goalie-diving")[0];
                    var handlingDiv = fieldLocation.getElementsByClassName("goalie-handling")[0];
                    var kickingDiv = fieldLocation.getElementsByClassName("goalie-kicking")[0];
                    var reflexesDiv = fieldLocation.getElementsByClassName("goalie-reflexes")[0];
                    var speedDiv = fieldLocation.getElementsByClassName("goalie-speed")[0];
                    var positioningDiv = fieldLocation.getElementsByClassName("goalie-positioning")[0];
                    var playerImage = fieldLocation.getElementsByClassName("goalie-image")[0];
                    var popup = fieldLocation.getElementsByClassName("popup")[0];

                    var popupName = popup.getElementsByClassName("popupName")[0];
                    popupName.innerHTML = goalie['name'];
                    var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                    popupNationality.innerHTML = "Nationality: " + goalie['nationality'];
                    var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                    popupLeague.innerHTML = "League: " + goalie['league'];
                    var popupClub = popup.getElementsByClassName("popupClub")[0];
                    popupClub.innerHTML = "Club: " + goalie['club'];
                    var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                    popupPreferredFoot.innerHTML = "Preferred Foot: " + goalie['preferred_foot'];
                    var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                    popupWeakFoot.innerHTML = "Weak Foot Ability: " + goalie['weak_foot'];
                    // var leagueDiv = fieldLocation.getElementsByClassName("player-position")[0];

                    positionDiv.innerHTML = "GK";
                    overallRatingDiv.innerHTML = goalie['overall'];
                    nameDiv.innerHTML = goalie['name'];
                    divingDiv.innerHTML = goalie['diving'];
                    handlingDiv.innerHTML = goalie['handling'];
                    kickingDiv.innerHTML = goalie['kicking'];
                    reflexesDiv.innerHTML = goalie['reflexes'];
                    speedDiv.innerHTML = goalie['speed'];
                    positioningDiv.innerHTML = goalie['positioning'];

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
                    playerImage.src = "https://cdn.sofifa.com/players/" + idFirstHalf + "/" + idSecondHalf + "/21_240.png";
                    playerImage.setAttribute("onerror", "this.src='https://cdn.sofifa.com/players/notfound_0_240.png';");

                    fieldLocation.setAttribute("goalieid", goalie["goalie_id"]);
                }
                else{
                    sum = sum + goalie["overall"];
                    total = total + 1;
                    var teamAverageRating = document.getElementById("team-average-rating");
                    teamAverageRating.innerHTML = Math.round(sum/total);
                }
            }
        })

        var playerListElement = document.getElementById('draft-selections');
        playerListElement.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div>";

        makeActiveNotClickable();
        makeClickable();
    })
}

function deleteTeam(){
    var rating = document.getElementById('team-average-rating');
    rating.innerHTML='';

    var url = getAPIBaseURL() + '/deleteteam?teamid=' + getTeamId();
    console.log(url);
    fetch(url, {method: 'get'})

    resetTeam()

    fillInTeamSelector();
    setFormation("4-3-3");
    makeClickable()
}

function makeClickable() {
    var inactiveGoalieCard = document.getElementsByClassName("inactive-goalie-card")[0];
    inactiveGoalieCard.setAttribute("onclick", "onPositionDraft(this)");
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
    var inactiveCardsGoalie = document.getElementsByClassName("inactive-goalie-card");
    for (var card of inactiveCardsGoalie) {
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

function setInactiveCard(card){
    card.setAttribute("class", "inactive-card");
    htmlContents = "<span class='popup'>" +
                        "<div class='popupName'></div>" +
                        "<div class='popupCountry'></div>" +
                        "<div class='popupLeague'></div>" +
                        "<div class='popupClub'></div>" +
                        "<div class='popupPreferredFoot'></div>" +
                        "<div class='popupWeakFoot'></div>" +
                        "<div class='popupSkillMoves'></div>" +
                    "</span>" +
                    "<div class='player-overall-rating'></div>" +
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
                    "<img class='player-image' src='https://www.freeiconspng.com/uploads/plus-sign-icon-31.png'>" +
                    "<div class='hide' id='displayPlayerStats'></div>";
    card.innerHTML = htmlContents;
}

function setInactiveCardSelection(card){
    card.setAttribute("class", "inactive-card");
    htmlContents = "<span class='popup'>" +
                        "<div class='popupName'></div>" +
                        "<div class='popupCountry'></div>" +
                        "<div class='popupLeague'></div>" +
                        "<div class='popupClub'></div>" +
                        "<div class='popupPreferredFoot'></div>" +
                        "<div class='popupWeakFoot'></div>" +
                        "<div class='popupSkillMoves'></div>" +
                    "</span>" +
                    "<div class='player-overall-rating'></div>" +
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
    card.setAttribute("class", "inactive-goalie-card");
    htmlContents = "<span class='popup'>" +
                        "<div class='popupName'></div>" +
                        "<div class='popupCountry'></div>" +
                        "<div class='popupLeague'></div>" +
                        "<div class='popupClub'></div>" +
                        "<div class='popupPreferredFoot'></div>" +
                        "<div class='popupWeakFoot'></div>" +
                    "</span>" +
                    "<div class='player-overall-rating'></div>" +
                    "<div class='player-position'></div>" +
                    "<div class='player-nationality'></div>" +
                    "<div class='player-club'></div>" +
                    "<div class='goalie-name'></div>" +
                    "<div class='goalie-diving'></div>" +
                    "<div class='goalie-handling'></div>" +
                    "<div class='goalie-kicking'></div>" +
                    "<div class='goalie-reflexes'></div>" +
                    "<div class='goalie-speed'></div>" +
                    "<div class='goalie-positioning'></div>" +
                    "<div class='player-league'></div>" +
                    "<img class='goalie-image' src='https://www.freeiconspng.com/uploads/plus-sign-icon-31.png'>";
    card.innerHTML = htmlContents;
}

function setFormation(newFormation){
    var playerField = document.getElementsByClassName("player-field")[0];
    var positions = playerField.children;

    if (newFormation == "4-4-2") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [1,3,5,6,8,9,10,11,13,14,17];
            position.removeAttribute("onclick");
            position.removeAttribute("class");
            position.innerHTML = "";
            if(formationPositions.includes(i)){
                if (i != 17) {
                    setInactiveCard(position);
                }
                else {
                    setInactiveGoalieCard(position);
                }
            }
        }
    }
    else if (newFormation == "4-3-3") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [0,2,4,6,7,8,10,11,13,14,17];
            position.removeAttribute("onclick");
            position.removeAttribute("class");
            position.innerHTML = "";
            if(formationPositions.includes(i)){
                if (i != 17) {
                    setInactiveCard(position);
                }
                else {
                    setInactiveGoalieCard(position);
                }
            }
        }
    }
    else if (newFormation == "4-5-1") {
        for (var i = 0; i < positions.length; i ++) {
            var position = positions[i];
            var formationPositions = [2,5,6,7,8,9,10,11,13,14,17];
            position.removeAttribute("onclick");
            position.removeAttribute("class");
            position.innerHTML = "";
            if(formationPositions.includes(i)){
                if (i != 17) {
                    setInactiveCard(position);
                }
                else {
                    setInactiveGoalieCard(position);
                }
            }
        }
    }
    if (!isDraft) {
        fillInPositionSelector();
    }
}

//'''––––––––––––––––––––––––––– Draft Functions –––––––––––––––––––––––––––'''

function onPositionDraft(obj) {
    var position = obj.getAttribute("position");
    var positionIndex = obj.getAttribute("positionindex")
    if (positionIndex == 17) {
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
                var player = players[i];
                card.setAttribute("class", "active-card");
                //card.setAttribute("onmouseover", displayPlayerStats(this, player));


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
                var popup = card.getElementsByClassName("popup")[0];

                var popupName = popup.getElementsByClassName("popupName")[0];
                popupName.innerHTML = player['name'];
                var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                popupNationality.innerHTML = "Nationality: " + player['nationality'];
                var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                popupLeague.innerHTML = "League: " + player['league'];
                var popupClub = popup.getElementsByClassName("popupClub")[0];
                popupClub.innerHTML = "Club: " + player['club'];
                var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                popupPreferredFoot.innerHTML = "Preferred Foot: " + player['preferred_foot'];
                var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                popupWeakFoot.innerHTML = "Weak Foot Ability: " + player['weak_foot'];
                var popupSkillMoves = popup.getElementsByClassName("popupSkillMoves")[0];
                popupSkillMoves.innerHTML = "Skill Moves: " + player['skill_moves'];
                // var leagueDiv = card.getElementsByClassName("player-position")[0];

                // var positionsPlayed = player['position'].split(", ");
                // console.log(positionsPlayed);
                // var relevantPosition = positionsPlayed[0];
                // for (var pos of positionsPlayed) {
                //     if (pos == position) {
                //         relevantPosition = pos;
                //     }
                // }
                positionDiv.innerHTML = position;
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
            }
            makeNotClickable();
            makeSelectionsClickable();
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
                card.setAttribute("class", "active-goalie-card");
                var goalie = goalies[i];

                var overallRatingDiv = card.getElementsByClassName("player-overall-rating")[0];
                // var nationalityDiv = card.getElementsByClassName("goalie-nationality")[0];
                // var clubDiv = card.getElementsByClassName("goalie-position")[0];
                var positionDiv = card.getElementsByClassName("player-position")[0];
                var nameDiv = card.getElementsByClassName("goalie-name")[0];
                var divingDiv = card.getElementsByClassName("goalie-diving")[0];
                var reflexesDiv = card.getElementsByClassName("goalie-reflexes")[0];
                var handlingDiv = card.getElementsByClassName("goalie-handling")[0];
                var kickingDiv = card.getElementsByClassName("goalie-kicking")[0];
                var speedDiv = card.getElementsByClassName("goalie-speed")[0];
                var positioningDiv = card.getElementsByClassName("goalie-positioning")[0];
                var goalieImage = card.getElementsByClassName("goalie-image")[0];
                var popup = card.getElementsByClassName("popup")[0];

                var popupName = popup.getElementsByClassName("popupName")[0];
                popupName.innerHTML = goalie['name'];
                var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                popupNationality.innerHTML = "Nationality: " + goalie['nationality'];
                var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                popupLeague.innerHTML = "League: " + goalie['league'];
                var popupClub = popup.getElementsByClassName("popupClub")[0];
                popupClub.innerHTML = "Club: " + goalie['club'];
                var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                popupPreferredFoot.innerHTML = "Preferred Foot: " + goalie['preferred_foot'];
                var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                popupWeakFoot.innerHTML = "Weak Foot Ability: " + goalie['weak_foot'];
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

                card.setAttribute("playerid", goalie['goalie_id']);
                card.setAttribute("positionindex", positionIndex);
            }
            makeNotClickable();
            makeSelectionsClickable();
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

    continueFunc = false;
    if (!getTeamId()){
        createNewTeam();
    }else{
        continueFunc = true;
    }
    waitForIt();
    function waitForIt(){
        if (!continueFunc) {
            setTimeout(function(){waitForIt()},100);
        }else {
            addPlayerToTeam(playerId, positionIndex);
            displayTeam();
        }
    }
}

//'''––––––––––––––––––––––––––– Search Functions –––––––––––––––––––––––––––'''

function playerSearch(event){
    event.preventDefault();
    var position = event.target.elements.position.value;
    var name = event.target.elements.name.value;
    var league = event.target.elements.league.value;
    var club = event.target.elements.club.value;
    var nationality = event.target.elements.nationality.value;
    var preferredFoot = event.target.elements.preferredFoot.value;
    var paceLow = event.target.elements.paceLow.value;
    var paceHigh = event.target.elements.paceHigh.value;
    var shootingLow = event.target.elements.shootingLow.value;
    var shootingHigh = event.target.elements.shootingHigh.value;
    var passingLow = event.target.elements.passingLow.value;
    var passingHigh = event.target.elements.passingHigh.value;
    var dribblingLow = event.target.elements.dribblingLow.value;
    var dribblingHigh = event.target.elements.dribblingHigh.value;
    var defenseLow = event.target.elements.defenseLow.value;
    var defenseHigh = event.target.elements.defenseHigh.value;
    var physicalityLow = event.target.elements.physicalityLow.value;
    var physicalityHigh = event.target.elements.physicalityHigh.value;

    if(position == 'GK'){
        goalieSearch(event);
    }

    else {
        createSearchCards(position);

        var url = getAPIBaseURL() + '/players?draftmodeon=False' + '&name=' + name + '&club=' + club + '&position=' + position
        + '&league=' + league + '&nationality=' + nationality + '&preferredfoot=' + preferredFoot + '&pacelow=' + paceLow
        + '&pacehigh=' + paceHigh + '&shootinglow=' + shootingLow + '&shootinghigh=' + shootingHigh + '&passinglow=' + passingLow
        + '&passinghigh=' + passingHigh + '&dribblinglow=' + dribblingLow + '&dribblinghigh=' + dribblingHigh
        + '&defenselow=' + defenseLow + '&defensehigh=' + defenseHigh + '&physicalitylow=' + physicalityLow
        + '&physicalityhigh=' + physicalityHigh;
        console.log(url);
        fetch(url, {method: 'get'})

        .then((response) => response.json())

        .then(function(players) {
            var playerListElement = document.getElementById('searched-players');
            if(playerListElement){
                for (var i = 0; i < 6 & i < players.length; i++) {
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
                    var popup = fieldLocation.getElementsByClassName("popup")[0];

                    var popupName = popup.getElementsByClassName("popupName")[0];
                    popupName.innerHTML = player['name'];
                    var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                    popupNationality.innerHTML = "Nationality: " + player['nationality'];
                    var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                    popupLeague.innerHTML = "League: " + player['league'];
                    var popupClub = popup.getElementsByClassName("popupClub")[0];
                    popupClub.innerHTML = "Club: " + player['club'];
                    var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                    popupPreferredFoot.innerHTML = "Preferred Foot: " + player['preferred_foot'];
                    var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                    popupWeakFoot.innerHTML = "Weak Foot Ability: " + player['weak_foot'];
                    var popupSkillMoves = popup.getElementsByClassName("popupSkillMoves")[0];
                    popupSkillMoves.innerHTML = "Skill Moves: " + player['skill_moves'];
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
                    card.setAttribute("id", "draft-selections");
                    //makeSelectionsClickable();
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
    var nationality = event.target.elements.nationality.value;
    var league = event.target.elements.league.value;


    createSearchCards(position);

    var url = getAPIBaseURL() + '/goalies?draftModeOn=False' + '&name=' + name + '&club=' + club + '&league=' + league
    + '&nationality=' + nationality;
    console.log(url);
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(goalies) {
        var goalieListElement = document.getElementById('searched-players');
        if(goalieListElement){
            for (var i = 0; i < 6 & i < goalies.length; i++) {
                var card = goalieListElement.children[i];
                card.setAttribute("class", "active-goalie-card");
                var goalie = goalies[i];

                var overallRatingDiv = card.getElementsByClassName("player-overall-rating")[0];
                // var nationalityDiv = card.getElementsByClassName("player-nationality")[0];
                // var clubDiv = card.getElementsByClassName("player-position")[0];
                var positionDiv = card.getElementsByClassName("player-position")[0];
                var nameDiv = card.getElementsByClassName("goalie-name")[0];
                var divingDiv = card.getElementsByClassName("goalie-diving")[0];
                var reflexesDiv = card.getElementsByClassName("goalie-reflexes")[0];
                var handlingDiv = card.getElementsByClassName("goalie-handling")[0];
                var kickingDiv = card.getElementsByClassName("goalie-kicking")[0];
                var speedDiv = card.getElementsByClassName("goalie-speed")[0];
                var positioningDiv = card.getElementsByClassName("goalie-positioning")[0];
                var goalieImage = card.getElementsByClassName("goalie-image")[0];
                var popup = fieldLocation.getElementsByClassName("popup")[0];

                var popupName = popup.getElementsByClassName("popupName")[0];
                popupName.innerHTML = player['name'];
                var popupNationality = popup.getElementsByClassName("popupCountry")[0];
                popupNationality.innerHTML = "Nationality: " + player['nationality'];
                var popupLeague = popup.getElementsByClassName("popupLeague")[0];
                popupLeague.innerHTML = "League: " + player['league'];
                var popupClub = popup.getElementsByClassName("popupClub")[0];
                popupClub.innerHTML = "Club: " + player['club'];
                var popupPreferredFoot = popup.getElementsByClassName("popupPreferredFoot")[0];
                popupPreferredFoot.innerHTML = "Preferred Foot: " + player['preferred_foot'];
                var popupWeakFoot = popup.getElementsByClassName("popupWeakFoot")[0];
                popupWeakFoot.innerHTML = "Weak Foot Ability: " + player['weak_foot'];
                // var leagueDiv = card.getElementsByClassName("player-position")[0];

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
