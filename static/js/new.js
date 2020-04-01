// Your code starts here
$(document).ready(function() {

    var teamPokemonList = [];
    var pokemonData = {};
            
    $.ajax({
        method: "GET",
        url: "/api/pokemon",
        success: function(data) {
            pokemonData = data;
        }
    });
    
    $(".js-submit").click(createNewTeam);
    $("#js-pokemon-search").on("input", openAutocomplete);
    
    function openAutocomplete() {
        $(this).off();
        $autocompleteBox = `<div class="autocomplete"></div>`;
        $(this).closest("form").append($autocompleteBox);
        $("#js-pokemon-search").on("keyup", refreshAutocomplete);
    }

    function refreshAutocomplete() {
        $(".autocomplete").empty();
        var searchString = $(this).val();
        if (searchString.length === 0) {return false;}
        console.log(searchString);
        var searchResults = pokemonSearch(searchString);
        for (i = 0; i < searchResults.length; i++) {
            console.log(searchResults[i]);
            $autocompleteEntry = `<div class="autocomplete-entry" id="${searchResults[i]}">${searchResults[i]}</div>`;
            $(".autocomplete").append($autocompleteEntry);
        }
    }

    function pokemonSearch(searchString) {
        numToMatch = searchString.length;
        searchResults = [];
        for (i = 0; i < pokemonData.length; i++) {
            if (pokemonData[i]["name"].slice(0,numToMatch).toLowerCase() === searchString.toLowerCase()) {
                searchResults.push(pokemonData[i]["name"]);
                console.log(`testing ${pokemonData[i]["name"].slice(0,numToMatch)} and ${searchString.toLowerCase()}`);
            }
        }
        return searchResults;
    }

    function createNewTeam() {
        formDataAsArray = $("#js-new-team").serializeArray();
        dataToSend = {};
        $.map(formDataAsArray, function(n) {
            dataToSend[`${n.name}`] = `${n.value}`;
        });
        $.ajax({
            method: "POST",
            url: '/teams',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(dataToSend),
            success: function(data) {
                window.location.pathname = "/";
            }
        });
    }
    
    function changeLevelIfUpdated(n) {
        idForLevelUpdate = `${n.name}`.slice(5);
        for (i = 0; i < teamPokemonList.length; i++) {
            if (idForLevelUpdate == teamPokemonList[i]["pokemon_id"]) {
                if (teamPokemonList[i]["level"] != `${n.value}`) {
                    teamPokemonList[i]["level"] = `${n.value}`;
                    anyPokemonChanges = true;
                    return true;
                }
            }
        }
    }
    function removePokemonRow() {
        pokemon = $(this).attr("value");
        $(this).closest("tr").hide();
        for (i = 0; i < teamPokemonList.length; i++) {
            if (teamPokemonList[i]["pokemon_id"] == pokemon){
                teamPokemonList.splice(i, 1);
                anyPokemonChanges = true;
            }
        }
    }
});

