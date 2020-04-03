// Your code starts here
$(document).ready(function() {

    var teamPokemonList = [];
    
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
        if (searchString.length < 2) {return false;}
        pokemonSearch(searchString);
    }

    function pokemonSearch(searchString) {
        $.ajax({
            method: "GET",
            url: `/api/pokemon/search?search=${searchString}`,
            success: function(data) {
                console.log(data);
                var data_keys = Object.keys(data);
                console.log(data_keys);
                data_keys.forEach(function(i) {
                    $autocompleteEntry = `<div class="autocomplete-entry" id="${data[i]['name']}">${data[i]['name']}</div>`;
                    $(".autocomplete").append($autocompleteEntry);
                });
            }
        });
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

