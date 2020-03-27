// Your code starts here
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/api" + window.location.pathname,
        success: function(data) {
            $(".team-name").html(data.name);
            $(".team-description").text(data.description);
            for (var j = 0; j < data.pokemon.length; j++) {
                var pokemon_id = data.pokemon[j];
                $.ajax({
                    method: "GET",
                    url: "/api/pokemon/" + pokemon_id,
                    success: function(pokemon) {
                        $(".team-pokemon").append(`
                            <tr>
                                <td><img class="pokemon-image" src="${pokemon.image_url}" /></td>
                                <td><a class="pokemon" href="/pokemon/${pokemon.id}">${pokemon.name}</a></td>
                                <td></td>
                                <td>${pokemon.types}</td>
                            </tr>
                        `)
                    }
                });
                
            }
        }
    })
})