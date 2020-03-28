// Your code starts here
$(document).ready(function() {
    var team = {};
    $.ajax({
        method: "GET",
        url: "/api" + window.location.pathname.replace("/edit", ""),
        success: function(data) {

            // Save data to the global variable so you can make changes to it when you edit team members
            team = data;

            // Update back link so it goes to the team page
            $(".back").attr("href", `/teams/${team.id}`);

            // Populate team name in input field
            $("#name").val(team.name);

            // Populate description in textarea
            $("#description").val(team.description);
            
            // Create the team member table so the user can add, update, or delete pokemon from the team
            for (var i = 0; i < team.members.length; i++) {
                var member = team.members[i];

                // Insert markup to the container BEFORE the API call with the right member ID
                // This part is tricky because of the team member's level - you can't get it from /api/pokemon/:id
                $(".team-pokemon").append(`
                    <tr class="team-member-${member.pokemon_id}">
                        <td><img class="pokemon-image" /></td>
                        <td class="name"><a href="/pokemon/${member.pokemon_id}"></a></td>
                        <td class="level"><input type="text" value="${member.level}" /></td>
                        <td class="types"></td>
                        <td class="remove"><a href="#">Remove</button></td>
                    </tr>
                `);

                $.ajax({
                    method: "GET",
                    url: "/api/pokemon/" + member.pokemon_id,
                    success: function(pokemon) {
                        // Add pokemon information based on ID
                        // Note: the pokemon's level is not set here! It's done before the API call
                        $member = $(".team-member-" + pokemon.id);
                        $member.find("img").attr("src", pokemon.image_url);
                        $member.find(".name a").text(pokemon.name);
                        $member.find(".types").text(pokemon.types);
                    }
                });
            }
        }
    })
})