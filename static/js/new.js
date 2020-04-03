// Your code starts here
$(document).ready(function() {

    var team = {
        "name": "",
        "description": "",
        "members": []
    };
    $(".js-submit").click(createNewTeam);
    $("#js-pokemon-search").on("input", openAutocomplete);

    function openAutocomplete() {
        $(this).off();
        $autocompleteBox = `<div class="autocomplete"></div>`;
        $(this).closest("form").append($autocompleteBox);
        $("#js-pokemon-search").on("keyup", refreshAutocomplete);
    }

    function refreshAutocomplete() {
        var key = event.which;
        if (key === 13){
            $(".autocomplete :first-child").trigger('click');
        }
        else if (key === 40){
            $(".autocomplete :first-child").trigger('focus');
        }
        else { 
            $(".autocomplete").show();
            $(".autocomplete").empty();
            var searchString = $(this).val();
            if (searchString.length < 2) {return false;}
            pokemonSearch(searchString);
        }
    }

    function pokemonSearch(searchString) {
        $.ajax({
            method: "GET",
            url: `/api/pokemon/search?search=${searchString}`,
            success: function(data) {
                var data_keys = Object.keys(data);
                data_keys.forEach(function(i) {
                    $autocompleteEntry = `<div class="autocomplete-entry" id="${data[i]['id']}" tabindex="0">
                            <span class="id-tag">#${data[i]['id']}</span>${data[i]['name']}</div>`;
                    $(".autocomplete").append($autocompleteEntry);
                    $(`#${data[i]['id']}`).click(addToTeam);
                    $(`#${data[i]['id']}`).on("keyup", keypressHandler);
                });
            }
        });
    }

    function keypressHandler() {
        var key = event.which;
        if (key === 13) {
            $(this).trigger("click");
        }
        if (key === 40 && ($(this).next(".autocomplete-entry").length != 0)) {
            $(this).next(".autocomplete-entry").trigger("focus");
        }
        if (key === 38) {
            if ($(this).prev(".autocomplete-entry").length != 0) {
                $(this).prev(".autocomplete-entry").trigger("focus");
            }
            else {
                $("#js-pokemon-search").trigger("focus");
            }
        }
    }

    function addToTeam() {
        $(".js-teams-pokemon").show();
        var rowId = $(this).attr("id");
        $.ajax({
            method: "GET",
            url: `/api/pokemon/${rowId}`,
            success: function(data) {
                $pokemonRow = 
                `<tr id="row${data.id}">
                    <td><img class="poke-image" src=${data.image_url}></td>
                    <td><a href="/pokemon/${data.id}">${data.name}</a></td>
                    <td><input type="number" name="level" value="1" placeholder="1" class="level-input" id="js-change-${data.id}"></td>
                    <td>${data.types}</td>
                    <td><button type="button" form="js-new-team"  id="js-remove-${data.id}" value="${data.id}">Remove</button></td>
                </tr>`;
                var newMember = {
                    'pokemon_id':data.id,
                    'level':1
                    };
                team["members"].push(newMember);
                $(".js-teams-pokemon").append($pokemonRow);
                $(`#js-remove-${data.id}`).click(removePokemonRow);
                $(".autocomplete").empty();
                $(".autocomplete").hide();
                $("#js-pokemon-search").val('');
                $("#js-pokemon-search").off();
                $("#js-pokemon-search").on("keyup", refreshAutocomplete);
            }
        })
    }

    function createNewTeam() {
        team['name'] = $(".js-team-name-input").val();
        team['description'] = $(".js-team-description-input").val();
        console.log(team);
        $.ajax({
            method: "POST",
            url: '/api/teams',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(team),
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
        for (i = 0; i < team["members"].length; i++) {
            if (team["members"][i]["pokemon_id"] == pokemon) {
                team["members"].splice(i,1);
                console.log(team["members"]); 
                return true;
            }
        }  
    }
});

