import * as $ from "jquery";

export function changePage(pageName) {
    console.log(pageName);
    if (pageName) {
        $.get("../../pages/" + pageName + ".html")
            .done((data) => {
                $("#app").html(data);
                
            })
            .fail((error) => {
                console.log("error " + error);
                alert("Error loading page: " + error.statusText);
                $.get("../../pages/home.html", (data) => {
                    $("#app").html(data);
                }).fail((err) => {
                    console.log("Error loading home: " + err);
                });
            });
    } else {
        $.get("../../pages/home.html", (data) => {
            $("#app").html(data);
        }).fail((error) => {
            console.log("error " + error);
            alert("Error loading home: " + error.statusText);
        });
    }
}

