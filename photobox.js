import gallery from "./gallery.js";

function init(server_url = "https://webetu.iutnc.univ-lorraine.fr") {
    gallery.init(server_url)
}

function load(uri) {

}

export default {
    init: init,
    load: load
}


window.addEventListener("load", ev => init());
