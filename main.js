//create an empty array on startup
let animeHistory = []
let vessels = [];
let suptCompany = "";

const API_BASE = "https://talos.marmaras-nav.gr/"
const API_VESSELS = API_BASE + "vessels"
const HISTORY_STORAGE_KEY = 'HISTORY_KEY'

/**
 * add an anime to the history and updates display
 */
function updateHistory(anime) {
    animeHistory.push(anime)

    //Save the array in the local storage. JSON.stringify allows to serialize the array to a string
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(animeHistory))

    //update display
    addAnimeToHistoryTag(anime)
}

/**
 * loadAnAnime from the internet and place it on a target element
 */
/*async function onOkButtonClickAsync() {
    let targetElementId = '#main_anime'
    let animeId = document.querySelector("#anime_id_input").value
    try {
        const response = await fetch(API_VESSELS + animeId)
        if (!response.ok) {
            return
        }
        const anime = await response.json()
        console.log("anime", anime)
        document.querySelector(targetElementId).innerHTML = buildAnimeMarkup(anime)

        updateHistory(anime)
    } catch (err) {
        console.error(`error ${err}`)
    }
}*/

/**
 * The history is serrialized as a JSON array. We use JSON.parse to convert is to a Javascript array
 */
/*function getLocalHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY))
}

async function onLoadAsync() {
    //load the history from cache
    let history = getLocalHistory()
    if (history !== null) {
        //set the animeHistory array and update the display
        animeHistory = history
        animeHistory.forEach(anime => addAnimeToHistoryTag(anime))
    }

    //Install the service worker
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js')
            console.log(`Service worker registered ${serviceWorker}`)
        } catch (err) {
            console.error(`Failed to register service worker: ${err}`)
        }
    }
}
*/

async function onLoadAsync() {
    if (typeof(Storage) !== "undefined") {
        if ( (localStorage.getItem("supt_company")) && (localStorage.getItem("supt_name")) ) {
            document.getElementById("suptName").innerHTML = localStorage.getItem("supt_name");
            loadVesselsList();          
        } else {
            location.href = "register.html";
        }
    } else {
        document.getElementById("status").innerHTML = "No Web Storage support";
    }
    

    if (vessels) {
        let vesselsDropdown = document.getElementById("vessels_select");
        vesselsDropdown.length = 0;

        let defaultOption = document.createElement('option');
        defaultOption.text = 'Select Vessel';

        vesselsDropdown.add(defaultOption);
        vesselsDropdown.selectedIndex = 0;

        let option;
        for (i = 0; i < vessels.length; i++) {
            option = document.createElement('option');
            option.text = vessels[i].name;
            option.value = vessels[i].name;
            vesselsDropdown.add(option);
        }
    } 

    //Install the service worker
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js')
            console.log(`Service worker registered ${serviceWorker}`)
        } catch (err) {
            console.error(`Failed to register service worker: ${err}`)
        }
    }
}

//load vessels list from localStorage or dropbox
function loadVesselsList() {
    //localStorage.removeItem("vessels");
    if (localStorage.getItem("vessels")) {
        vessels = JSON.parse(localStorage.getItem("vessels"));
    } else {
        //check internet connection and load
        if (navigator.onLine) {
            document.getElementById("status").innerHTML = "online"; 
            //TODO load vessels' list from dropbox
            loadVessels();
        } else {
            document.getElementById("status").innerHTML = "offline";
        }
    }
}

//load vessels list from dropbox (local only for now)
function loadVessels() {
    var request = new XMLHttpRequest();
    request.open("GET", "vessels.json", false);
    request.send(null);
    vessels = JSON.parse(request.responseText);     
    localStorage.setItem("vessels", JSON.stringify(vessels));
}


async function onUpdateVesselsButtonClickAsync() {
    loadVessels();
   /* let targetElementId = '#main_anime'
    let animeId = document.querySelector("#anime_id_input").value
    try {
        const response = await fetch(API_VESSELS + animeId)
        if (!response.ok) {
            return
        }
        const anime = await response.json()
        console.log("anime", anime)
        document.querySelector(targetElementId).innerHTML = buildAnimeMarkup(anime)

        updateHistory(anime)
    } catch (err) {
        console.error(`error ${err}`)
    }*/
}

async function onSendSMSClickAsync() {

    //Get Vessel/Departure/Est.CheckIn values
    let selectedVessel = document.getElementById("vessels_select");
    let departureDate = document.getElementById("departure");
    let estCheckInDate = document.getElementById("checkIn");
    
    let vesselVal;
    let departureVal;
    let estCheckInVal;
    
    if (selectedVessel.value) {
        if (selectedVessel.selectedIndex > 0)
            vesselVal = selectedVessel.value;
    }
    
    if (departureDate.value) {
        let date = new Date(departureDate.value);
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        departureVal = [day, month, year].join('/');
    }
    
    if (estCheckInDate.value) {
        let date = new Date(estCheckInDate.value);
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        estCheckInVal = [day, month, year].join('/');
    }
    
    let smsBody = 'ATTADV-' + vesselVal + '-' + departureVal + '-' + estCheckInVal;
    //alert(smsBody);
    
    if (typeof vesselVal != 'undefined') {
        window.open('sms://6938600342;?&body=' + smsBody);
    } else {
        alert('You must select a vessel');
    }
            
} 


async function onLoadRegistration() {


    var responseMessageDiv = document.getElementById("responseMessage");
    responseMessageDiv.style.visibility = "hidden";
    
    var responseMessageMainDiv = document.getElementById("response-message");
    responseMessageMainDiv.style.visibility = "hidden";
    
    if (typeof(Storage) !== "undefined") {
        //check internet connection
        if (navigator.onLine) {
            document.getElementById("status").innerHTML = "";
            document.getElementById("register").disabled = false;
        } else {
            document.getElementById("status").innerHTML = "offline";
            document.getElementById("register").disabled = true;
        }
    } else {
        document.getElementById("status").innerHTML = "No Web Storage support";
    }
    
    //listeners  
    /*var registerBtn = document.getElementById("register");
    registerBtn.addEventListener("click", function(event) {
        event.preventDefault();     
        //get supt data using mobile
        getSuperintendentData();
        
    }, false);*/
    
}
    
function getSuperintendentData() {
    
    //on success
    var response = "{\"id\":158, \"name\":\"Cpt Chondrogiannos Iakovos\", \"company\":\"delta\"}";
    showWelcomeMessage(response);
    
    /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
  
        }
    };
    xhttp.open("GET", "url", true);
    xhttp.send();*/
    //location.href = "p.html";
    
    setTimeout(function () {
        window.location.href = "index.html";
    }, 3000); 

}

function showWelcomeMessage(response) {
    var supt = JSON.parse(response);
    var responseMessageDiv = document.getElementById("responseMessage");
    var responseMessageMainDiv = document.getElementById("response-message");
    
    responseMessageDiv.style.visibility = "visible";
    responseMessageMainDiv.style.visibility = "visible";
    let responseDiv = document.getElementById("login");
    //TODO
    if (response) {
        let loginDiv = document.getElementById("login");
        loginDiv.style.visibility = "hidden";
        loginDiv.style.height = 0
        responseDiv.classList.remove("reg-failure");
        responseDiv.classList.remove("reg-success");
        responseDiv.classList.add("reg-success");
        responseMessageDiv.innerHTML = "Welcome " + supt.name;
        setLocalStorageParams(supt);
    } else {
        responseDiv.classList.remove("reg-failure");
        responseDiv.classList.remove("reg-success");
        responseDiv.classList.add("reg-failure");       
        responseMessageDiv.innerHTML = "Registration failed";
    }
    
}

function setLocalStorageParams(supt) {
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem("vessels");
        localStorage.removeItem("supt_name");
        localStorage.removeItem("supt_company");
    
        //on success        
        localStorage.setItem("supt_name", supt.name);
        localStorage.setItem("supt_company", supt.company);
    }
}
