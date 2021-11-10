let img_url = "https://webetu.iutnc.univ-lorraine.fr";


function load(json) {
    let html = "<div class='row'>";
    let c = 0;
    json.forEach(
        e => {
            html += generateHTML(c, e);
            if (c === 3) {
                c = 0;
            }
            c++;

        }
    );
    insere(html)
}

function generateHTML(c, photo) {
    let html = "";
    if (c === 3) {
        html += "</div><div class='row  '>"
    } else if (c === -1) {
        html += "<div class='row'>"
    }
    html += `<div class="col-md rounded ">
                <img class="w-75 h-75 m-lg-3 shadow p-1"
                     data-img="${img_url}${photo.photo.original.href}"
                     data-uri="${img_url}${photo.links.self.href}"
                     alt="${photo.photo.titre}"
                     src="${img_url}${photo.photo.thumbnail.href}">
                <div>${photo.photo.titre}</div>
            </div>`;
    return html;
}

function insere(html) {
    $(".row").remove();
    $(html).appendTo("#photo_box")
}

export default {
    load: load
}
