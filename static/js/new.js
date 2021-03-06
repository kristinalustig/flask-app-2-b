// Your code starts here
$(document).ready(function() {

    var team = {
        "members": []
    };
    $(".js-submit").click(createNewTeam);
    $("#js-pokemon-search").on("keyup", keyupHandler);

    function refreshAutocomplete() {
        $(".autocomplete").empty();
        var searchString = $(".js-pokemon-search").val();
        if (searchString.length < 2) {return false;}
        $(".autocomplete").show();
        pokemonSearch(searchString);
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
                    $(`#${data[i]['id']}`).on("click", addToTeam);
                    $(`#${data[i]['id']}`).on("keyup", keyupHandler);
                });
            }
        });
    }

    function keyupHandler() {
        var key = event.which;
        var $topOfList = $(".autocomplete :first-child");
        //if the focus is the search bar
        if ($(this).attr("id") === "js-pokemon-search") {
            if (key === 13) { //enter
                $topOfList.trigger('click');
            }
            else if (key === 40) { //arrow down
                $topOfList.focus();
            }
            else {
                refreshAutocomplete();
            }
        } else {
        //if the focus is one of the autocomplete entries
            if (key === 13) {
                $(this).trigger('click');
            } else if (key === 40) {
                $(this).next(".autocomplete-entry").focus();
            } else if (key === 38) {
                if ($(this) === $topOfList) {
                    $("#js-pokemon-search").focus();
                } else {
                    $(this).prev(".autocomplete-entry").focus();
                }
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
                $(".autocomplete").hide();
                $("#js-pokemon-search").val('');
                $("#js-pokemon-search").focus();
            }
        })
    }

    function createNewTeam() {
        team['name'] = $(".js-team-name-input").val();
        team['description'] = $(".js-team-description-input").val();
        var isInvalid = validateTeam();
        if (isInvalid) {
            return false;
        } else {
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
        
    }

    function validateTeam() {
        var isInvalid = false;
        if (team['name'].length === 0) {
            $(".js-name-error").show();
            isInvalid = true;
        } else {
            $(".js-name-error").hide();
        }
        if (team['description'].length === 0) {
            $(".js-description-error").show();
            isInvalid = true;
        } else {
            $(".js-description-error").hide();
        }
        if (team["members"].length < 2) {
            $(".js-pokemon-error").show();
            isInvalid = true;
        } else {
            $(".js-pokemon-error").hide();
        }
        return isInvalid;
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

