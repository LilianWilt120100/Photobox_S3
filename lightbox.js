import gallery from "./gallery.js";
import photoloader from "./photoloader.js";

let img_url = "https://webetu.iutnc.univ-lorraine.fr";
let idMax;
let idMin;
let compteurTt;
let uriCourant;


function addInfo(resp, uri) {
    resp = resp.data;
    let html = `
        <div>
            <h2 class="text-primary"> ${resp.photo.titre}</h2>
            <div>
                <h4 class="text-left text-warning">Description : </h4>
                <div class="description m-lg-3 shadow-lg p-1 bg-info border-white rounded-lg text-white "><p>
                    ${resp.photo.descr} </p>
                </div>
            </div>
       </div>
   `;

    $(html).appendTo('.moreInfo');
  }

function chargerInfo(imageID) {
    axios.get(imageID, {
        withCredentials: true,
        responseType: "json"
    }).then(resp => addInfo(resp, imageID))
}



function creerBox(e) {
    let html = "";
    let src = $(e.target).attr('src');
    src = src.replace("small", "large");
    chargerInfo($(e.target).attr('data-uri'));
    html += `<div class="hide">
        </div>
        <div class="wrap">
        <div class="hidecontent">
            <button title="Close(Esc)" type="button" class="closebtn" >
                x
            </button>
                <img class="loadPhoto"
                     data-img="${$(e.target).attr('data-img')}"
                     data-uri="${$(e.target).attr('data-uri')}"
                     src="${src}">
                     <button class="butPrec"> </button>
                     <button class="butSuiv"></button>
                     <div class="moreInfo">

                     </div>
        </div>
        </div>`;
    $(html).appendTo('#photo_box');
    close();
    uriCourant = $(e.target).attr('data-uri');
    next();
    previous();

    compteurTt = ($(e.target).parent().parent().index()) * 3 + $(e.target).parent().index() + 1
}



function remove() {
    $('.hide').remove();
    $('.wrap').remove()
}


function maxMin() {
    axios.get(img_url + "/www/canals5/photobox/photos", {
        params: {
            offset: 0,
            size: 1
        },
        withCredentials: true,
        responseType: "json"
    }).then((response) => {
        max(response.data.photos[0].photo.id)
        let s = response.data.links.last.href.replace("/www/canals5/photobox/photos/?offset=", "").replace("size=", "");
        let strings = s.split("&");
        let off = strings[0] - 1
        let urif = "/www/canals5/photobox/photos/?offset=" + off + "&size=1"
        axios.get(img_url + urif, {
            withCredentials: true,
            responseType: "json"
        }).then((response) => {

            min(response.data.photos[0].photo.id)
        })
    })


}

function max(id) {
    idMax = id
}

function min(id) {
    idMin = id
}

function nextEle() {
    let uris = uriCourant.split("photos/")
    let id = parseInt(uris[1]) - 1
    if (id < idMin) id = idMax
    changerImage(uris[0] + "photos/" + id);
    compteurTt++;
    if (compteurTt > 9) {
        gallery.nextPage();
        compteurTt = 1
    }

}

function previouEle() {
    let uris = uriCourant.split("photos/")
    let id = parseInt(uris[1]) + 1
    if (id > idMax) id = idMin
    changerImage(uris[0] + "photos/" + id);
    compteurTt--;
    if (compteurTt < 1) {
        gallery.prevPage()
        compteurTt = 9
    }


}

function reloadMoreInfo(uri) {
    $(".moreInfo").empty();
    chargerInfo(uri);

}

function changerImage(datauri) {
    axios.get(datauri, {
        withCredentials: true,
        responseType: "json"
    }).then(function (response) {
        let src = img_url + response.data.photo.url.href
        let dataimg = src
        $('.loadPhoto').attr(
            {
                data: {
                    img: dataimg,
                    uri: datauri
                },
                src: src
            }
        );
    });
    uriCourant = datauri
    reloadMoreInfo(datauri)
}


let next = function () {
    $(".butSuiv").click(nextEle);
}

let previous = function () {
    $(".butPrec").click(previouEle);
}

let close = function () {
    $(".closebtn").click(remove);
}

let afficher = function () {
    maxMin()
    $(".col-md>img").click(creerBox);
}



export default {
    afficher: afficher
};
