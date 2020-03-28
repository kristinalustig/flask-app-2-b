// Your code starts here
$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/api" + window.location.pathname.replace("/edit", ""),
        success: function(data) {

            // Update back link so it goes to the team page
            $(".back").attr("href", `/teams/${data.id}`);

            $("#name").val(data.name);
            $("#description").val(data.description);
        }
    })
})