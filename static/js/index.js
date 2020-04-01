// Your code starts here
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/api/pokemon",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var pokemon = data[i];
                var $pokemon = $(`<a href="/pokemon/${pokemon.id}"></a>`).addClass("pokemon");
                var html = `
                    <h3>${pokemon.name}</h3>
                    <img class="pokemon-image" src=${pokemon.image_url} />
                `;
                $pokemon.append(html);
                $(".js-pokemon-container").append($pokemon);
            }
        }
    });
    
    $.ajax({
        method: "GET",
        url: "/api/teams",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var team = data[i];
                var $team = $(`<a href="/teams/${team.id}">${team.name}</a>
                `);
                $team.addClass("team")
                $(".js-teams-container").append($team);
            }
            $(".js-teams-container").append(`<button id="new" href="/new">+ Add New</button>`);
            $("#new").click(function() {
                window.location.pathname = "/new";
            })
        }
    })
})