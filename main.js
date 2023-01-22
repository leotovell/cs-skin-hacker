let draggableDiv = document.createElement("div");
let title = document.createElement("h1")
let description = document.createElement("p");
// let preSkinName = document.createElement("p");
let skinName = document.createElement("p");
let hint = document.createElement("p");
// let disclaimer = document.createElement("p");
hint.innerHTML = "<i>Result is automatically copied to clipboard<i>"
description.innerHTML = "<i>This lil script was made by FarmerJoe</i>"
title.innerHTML = "<strong>CS SKIN HACK!!</strong>"
// disclaimer.innerHTML = "<i>This may not be accurate</i>"

draggableDiv.append(title, description, document.createElement("hr"), skinName, document.createElement("hr"), hint)
draggableDiv.id = "draggableDiv"
draggableDiv.style.display = "block";



document.body.append(draggableDiv)

// Styling cos no css injection!!
draggableDiv.style.padding = "5px"
draggableDiv.style.position = "absolute";
draggableDiv.style.zIndex = 99
draggableDiv.style.backgroundColor = "white"
draggableDiv.style.textAlign = "center"
draggableDiv.style.border = "4px solid green"
draggableDiv.style.fontFamily = "Arial, Helvetica, sans-serif"
draggableDiv.style.cursor = "move"

// preSkinName.style.backgroundColor = "red"
// preSkinName.style.padding = "5px"
skinName.style.backgroundColor = "green"
skinName.style.padding = "5px"

dragElement(draggableDiv);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function toggleDraggableDiv(){
	let div = document.getElementById("draggableDiv")
	if (getComputedStyle(div).display == "block"){
		div.style.display = "none";
	}
	else{
		div.style.display = "block";
	}
}

let clientX, clientY, imageURL, returnedresponse, skin;

let weapons = ["deagle", "ump", "stattrak", "™", "skins", "skin", "factory new", "factorynew", "factory-new", "minimal-wear", "minimal wear", "min-wear", "min wear", "minimalwear", "field-tested", "field tested", "fieldtested", "well-worn", "well worn", "wellworn", "battle-scarred", "battle scarred", "battlescarred", "cs go", "cs-go", "csgo", "usp-s", "usp s", "usps", "glock-18", "glock 18", "glock18", "dual berettas", "dual-berettas", "p250", "tec-9", "tec9", "tec 9", "cz75-auto", "cz75 auto", "five-seven", "five seven", "desert eagle", "r8 revolver", "revolver", "mac-10", "mac 10", "mp9", "mp-9", "mp7", "mp-7", "mp5-sd", "mp5 sd", "mp5sd", "ump-45", "ump45", "p90", "p-90", "pp-bizon", "ppbizon", "pp bizon", "nova", "xm1014", "sawed-off", "sawed off", "mag-7", "mag 7", "mag7", "m249", "negev", "galil-ar", "galil ar", "galilar", "famas", "ak-47", "ak47", "ak 47", "m4a4", "m4a1-s", "m4a1", "m4a1 s", "ssg-08", "ssg08", "ssg 08", "scout", "sg-553", "sg 553", "sg553", "aug", "awp", "g3sg1", "scar-20", "scar", "scar20", "scar 20", "skeleton knife", "skeleton", "bayonet knife", "bayonet", "bowie knife", "bowie", "butterfly knife", "butterfly", "classic knife", "falchion knife", "falchion", "gut knife", "hunstmas knife", "karambit", "navaja", "m9 bayonet", "nomad knife", "paracord", "shadow daggers", "stiletto", "survival", "talon", "ursus", "glock", "knife", "huntsman"]
// ToDO add knives

document.addEventListener("mousemove", (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
})

let running = false;

document.body.addEventListener("keydown", (e) => {
    if(!running){
    let key = e.key;
    if(key == "Delete"){
        elements = document.elementsFromPoint(clientX, clientY);
        let i = 0;
        let len = elements.length;
        while (i < len){
            el = elements[i];
            if(el.tagName == "IMG"){
                running = true
                console.log("CSSKIN HACk ------- Querying!")
                // skinName.innerHTML = ""
                // preSkinName.innerHTML = "";
                imageURL = el.src;
                sendData(imageURL)
            }
            i++;
        }
    }
}
})

function sendData(url){
    fetch("http://127.0.0.1:5000/receiver",
    {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        // body: JSON.stringify(cars)
        body: JSON.stringify(url)
    }).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            // alert("something is wrong")
        }
    }).then(jsonResponse => {
        console.log(jsonResponse)
        returnedresponse = jsonResponse

        // Parse and remove wepaon names:
        // preSkinName.innerHTML = `Raw: ${returnedresponse}`
        // weapons.forEach(weapon => {
        //     returnedresponse = returnedresponse.toLocaleLowerCase().replace(weapon, "")
        // });
        navigator.clipboard.writeText(returnedresponse)
        skinName.innerHTML = `Final: ${returnedresponse}`;
        console.log(" -____--- PLEASE PASTE INTO ENTRY BOX --___-----")
        running = false;
    }
    ).catch((err) => console.error(err));
}


// Updated look into bot src code.

// src/commands/games/skin_game.py randimo skin at line 45
// db at src/util/database

// Skin data at res/skin_data.json

// from discord
//https://images-ext-2.discordapp.net/external/OoVC_XdchJpbtJrVDMBLaIrnCMlMm3Txg4y2-NczXJo/https/steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj8NrrHj1Rd6dd2j6fEp9T031Dg_kJlNTvyco-ddQ9tYVDQ_Fa7lO68jMC86MvOynZgvCQr-z-DyKRZB5bD/512fx384f


// from db
//https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj4OrzZglRd6dd2j6fFrNTw2gHh-UtvMmGgctKVe1dvMgrS_1W-xL_tg8O5tJ2cyiZiuCl0-z-DyOSIRCS_/512fx384f

// Parsed
// https/steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj8NrrHj1Rd6dd2j6fEp9T031Dg_kJlNTvyco-ddQ9tYVDQ_Fa7lO68jMC86MvOynZgvCQr-z-DyKRZB5bD/512fx384f

// db // https/steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj8NrrHj1Rd6dd2j6fEp9T031Dg_kJlNTvyco-ddQ9tYVDQ_Fa7lO68jMC86MvOynZgvCQr-z-DyKRZB5bD/512fx384f
// ds // https/steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj8NrrHj1Rd6dd2j6fEp9T031Dg_kJlNTvyco-ddQ9tYVDQ_Fa7lO68jMC86MvOynZgvCQr-z-DyKRZB5bD/512fx384f


// https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj4OrzZglRd6dd2j6fFrNTw2gHh-UtvMmGgctKVe1dvMgrS_1W-xL_tg8O5tJ2cyiZiuCl0-z-DyOSIRCS_/512fx384f
// https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTi5N09ajmoeHksj8NrrHj1Rd6dd2j6fEp9T031Dg_kJlNTvyco-ddQ9tYVDQ_Fa7lO68jMC86MvOynZgvCQr-z-DyKRZB5bD/512fx384f
