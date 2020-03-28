// Your code starts here
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/api" + window.location.pathname,
        success: function(data) {
            
            // Add team name
            $(".team-name").html(data.name);
            
            // Add description
            $(".team-description").text(data.description);

            // Add team members
            for (var j = 0; j < data.members.length; j++) {
                var member = data.members[j];

                // Insert markup to the container BEFORE the API call with the right member ID
                // This part is tricky because of the team member's level - you can't get it from /api/pokemon/:id
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
                        // Add pokemon information based on ID
                        // Note: the pokemon's level is not set here! It's done before the API call
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