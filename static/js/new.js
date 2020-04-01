// Your code starts here
$(document).ready(function() {

    teamPokemonList = [];
    pokemonData;
            
    $.ajax({
        method: "GET",
        url: "/api/pokemon",
        success: function(data) {
            pokemonData = data;
        }
    });
    
    $(".js-submit").click(createNewTeam);

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

