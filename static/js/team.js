// Your code starts here
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/api" + window.location.pathname,
        success: function(data) {
            $(".team-name").html(data.name);
            $(".team-description").text(data.description);
            for (var j = 0; j < data.members.length; j++) {
                var member = data.members[j];
                $(".team-pokemon").append(`
                    <tr class="team-member-${member.pokemon_id}">
                        <td><img class="pokemon-image" /></td>
                        <td><a class="pokemon" href="/pokemon/${member.pokemon_id}"></a></td>
                        <td class="level">${member.level}</td>
                        <td class="types"></td>
                    </tr>
                `)
                $.ajax({
                    method: "GET",
                    url: "/api/pokemon/" + member.pokemon_id,
                    success: function(pokemon) {
                        $member = $(".team-member-" + pokemon.id);
                        $member.find("img").attr("src", pokemon.image_url);
                        $member.find("a").text(pokemon.name);
                        $member.find(".types").text(pokemon.types);
                    }
                });
                
            }
        }
    })
})