import photoloader from "./photoloader.js";
import lightbox from "./lightbox.js";


let prev = "";
let next = "";
let url;


function init(server_url) {
    url = server_url;
    document.getElementById("load_gallery").addEventListener("click", ev => {
        $("#photo_box").empty();
        load(0)
    });
    document.getElementById("next").addEventListener("click", ev => nextPage());
    document.getElementById("previous").addEventListener("click", ev => prevPage());
}

function load(offset, uri = "/www/canals5/photobox/photos", param = {
    params: {
        offset: offset,
        size: 9
    },
    withCredentials: true,
    responseType: "json"
}) {
    axios.get(url + uri, param).then(resp => traiter_json(resp))

}

function nextPage() {
    load(0, next, {
        withCredentials: true,
        responseType: "json"
    })
}

function prevPage() {
    load(0, prev, {
        withCredentials: true,
        responseType: "json"
    })
}


function save(links) {
    prev = links.prev.href;
    next = links.next.href;
}

function traiter_json(json) {
    let parse = json.data;
    photoloader.load(parse.photos);
    lightbox.afficher();
    let lastp = prev;
    let lastn = next;
    save(parse.links);
    if (lastp === prev || lastp === "") {
        let href = parse.links.last.href;
        let s = href.replace("/www/canals5/photobox/photos/?offset=", "").replace("size=", "");
        let strings = s.split("&");
        let tot = parseInt(strings[0], 0) + parseInt(strings[1], 0);
        let off = tot - 9;
        prev = '/www/canals5/photobox/photos/?offset=' + off + "&size=9";
    }
    if (lastn === next) {
        let href = parse.links.first.href;
        if (href.endsWith("9")) {
            next = href
        } else {
            let s = href.replace("/www/canals5/photobox/photos/?offset=", "").replace("size=", "");
            let strings = s.split("&");
            let off = parseInt(strings[0], 0) - 1;
            next = '/www/canals5/photobox/photos/?offset=' + off + "$size=9";
        }
    }
}

export default {
    init: init,
    load: load,
    nextPage: nextPage,
    prevPage: prevPage
}
