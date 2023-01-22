let clientX, clientY, imageURL, returnedresponse, skin;

let weapons = ["factory new", "factorynew", "factory-new", "minimal-wear", "minimal wear", "min-wear", "min wear", "minimalwear", "field-tested", "field tested", "fieldtested", "well-worn", "well worn", "wellworn", "battle-scarred", "battle scarred", "battlescarred", "cs go", "cs-go", "csgo", "usp-s", "usp s", "usps", "glock-18", "glock 18", "glock18", "dual berettas", "dual-berettas", "p250", "tec-9", "tec9", "tec 9", "cz75-auto", "cz75 auto", "five-seven", "five seven", "desert eagle", "r8 revolver", "mac-10", "mac 10", "mp9", "mp-9", "mp7", "mp-7", "mp5-sd", "mp5 sd", "mp5sd", "ump-45", "ump45", "p90", "p-90", "pp-bizon", "ppbizon", "pp bizon", "nova", "xm1014", "sawed-off", "sawed off", "mag-7", "mag 7", "mag7", "m249", "negev", "galil-ar", "galil ar", "galilar", "famas", "ak-47", "ak47", "ak 47", "m4a4", "m4a1-s", "m4a1", "m4a1 s", "ssg-08", "ssg08", "ssg 08", "scout", "sg-553", "sg 553", "sg553", "aug", "awp", "g3sg1", "scar-20", "scar20", "scar 20", "skeleton knife", "skeleton", "bayonet knife", "bayonet", "bowie knife", "bowie", "butterfly knife", "butterfly", "knife", "classic knife", "falchion knife", "falchion", "gut knife", "hunstmas knife", "karambit", "navaja", "m9 bayonet", "nomad knife", "paracord", "shadow daggers", "stiletto", "survival", "talon", "ursus", "glock"]

document.addEventListener("mousemove", (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
})

document.body.addEventListener("keydown", (e) => {
    let key = e.key;
    if(key = "Delete"){
        elements = document.elementsFromPoint(clientX, clientY);
        let i = 0;
        let len = elements.length;
        while (i < len){
            el = elements[i];
            if(el.tagName == "IMG"){
                console.log("CSSKIN HACk ------- Querying!")
                imageURL = el.src;
                sendData(imageURL)
            }
            i++;
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
            alert("something is wrong")
        }
    }).then(jsonResponse => {
        console.log(jsonResponse)
        returnedresponse = jsonResponse

        // Parse and remove wepaon names:
        weapons.forEach(weapon => {
            returnedresponse = returnedresponse.replace(weapon, "")
        });
        console.log(returnedresponse)
        navigator.clipboard.writeText(returnedresponse)
        console.log(" -____--- PLEASE PASTE INTO ENTRY BOX --___-----")
    }
    ).catch((err) => console.error(err));
}
