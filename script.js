membersSelected = new Array();
shuffledMems = new Array();

const tempTable = document.getElementById("member-table");
var doc = document.getElementById("member-table");

function loadPage() {
   
    console.log("loading page");

    if (sessionStorage.getItem('tempTable') === null) {
        console.log("no page stored in session storage");
    }
    else {
        doc = JSON.parse(sessionStorage.getItem('tempTable'));
        console.log("page loaded from session storage");
    }

    console.log("page loaded");
}

function savePage() {

    setInterval(function () {
        sessionStorage.setItem("tempTable", JSON.stringify(doc));
        console.log("page saved");
    }, 5000);
}

function getMembers() {

    mems = new Array();

    var checks = document.querySelectorAll("input[type='checkbox']");

    for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            mems.push(checks[i].value);
        }
    }

    sessionStorage.setItem("membersSelected", JSON.stringify(mems));
};


function getSubstring(string, char1, char2) {
    return string.slice(
        string.indexOf(char1) + 2,
        string.lastIndexOf(char2),
    );
};


// Replace with your actual Spreadsheet ID
const spreadsheetId = '15WGUqz6w3TpvfbFM_U87ZX7vNfu8GUzB8urGdOIzQW0';

// Replace with your API Key
const apiKey = 'AIzaSyBCa46AANh21tPbRsQuSxmaAxNptD9-ScA';

// Construct the URL for Google Sheets API v4
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Index?key=${apiKey}`;

async function fetchGoogleSheetData() {
    try {
        // Fetch data from Google Sheets API
        const response = await fetch(url);
        const data = await response.json();

        // Extract rows from the data
        const rows = data.values;

        // Get the table body element
        const tableBody = document.getElementById('sheet');

        // Loop through the rows (starting from row 1 to skip headers)
        for (let i = 1; i < rows?.length ?? 0; i++) {
            const row = document.createElement('tr');

            // Loop through each cell in the row and create a table cell for each
            rows[i].forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cell;
                row.appendChild(cellElement);
            });

            // Append the row to the table
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
    }
}


function searchTable() {
    const searchInput = document.getElementById('search-input');
    if (searchInput != null) {
        const searchTable = document.getElementById('sheet');
        const rows = searchTable.querySelectorAll('tr');

        searchInput.addEventListener('input', function (e) {
            const q = e.target.value.toLowerCase();

            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const matchString = cells.map((n) => n.textContent.toLowerCase()).join(' ');
                const isMatch = matchString.includes(q);
                row.classList.toggle("hide", !isMatch);
            });
        });
    }
};

function displayChoice() {

    
    const songName = document.getElementById('song-name');
    const songURL = document.getElementById('song-url');
    const searchInput = document.getElementById('input');
    
    if (searchInput != null) {
        const searchTable = document.getElementById('sheet');
        const rows = searchTable.querySelectorAll('tr');
        
        
        searchInput.addEventListener('input', function (e) {
            const q = e.target.value.toLowerCase();
            
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                const matchString = cells.map((n) => n.textContent.toLowerCase()).join(' ');
                const isMatch = matchString.includes(q);
                row.classList.toggle("hide", !isMatch);
            });
        });
        
        for (var i = 0, row; row = searchTable.rows[i]; i++) {
            if (row.cells[1].textContent.toLowerCase() === searchInput.value.toLowerCase()) {
                songName.textContent = row.cells[1].textContent;
                console.log(row.cells[1].textContent);
                for (var j = 0, col; col = row.cells[j]; j++) {
                    if (j === 3) {
                        songURL.innerHTML = "<a href='" + row.cells[3].textContent + "'>" + row.cells[3].textContent + "</a>";
                        console.log(row.cells[3].textContent);

                        const thumbnailContainer = document.getElementById('song-container');
                
                        let videoId = '';
                
                        if (songURL.textContent.includes('&')) 
                        {
                            videoId = getSubstring(songURL.textContent, 'v=', '&');
                            console.log(videoId);
                        }
                        else if(songURL.textContent.includes("v=")) 
                        {
                            videoId = songURL.textContent.split('v=')[1];
                        }
                        else if(songURL.textContent.includes("ab_channel"))
                        {
                            videoId = getSubstring(songURL.textContent, 'v=', '&ab')
                        }
                        else if(songURL.textContent.includes("&list"))
                        {
                            videoId = getSubstring(songURL.textContent, 'v=', '&list')
                        }
                        else
                        {
                            videoId = getSubstring(songURL.textContent, 'e/', '?');
                            console.log(videoId);
                        }
                
                        const thumbnailURL = `http://img.youtube.com/vi/${videoId}/0.jpg`;
                
                        document.getElementById('song-image').src = thumbnailURL;
                        document.getElementById('song-image').style.display = 'block';
                    }
                }
            }
        }

    };

}

function addSong() {
    var table = document.getElementById("list");

    let groupName = document.getElementById("group-input").value;
    let songName = document.getElementById("song-name-input").value;
    let members = document.getElementById("members-input").value;
    let url = document.getElementById("url-input").value;
    let category = document.getElementById("category-input").value;
    let type = document.getElementById("type-input").value;
    let year = document.getElementById("year-input").value;
    let tags = document.getElementById("tags-input").value;

    let newRow = table.insertRow(1);

    newRow.insertCell(0).innerHTML = groupName;
    newRow.insertCell(1).innerHTML = songName;
    newRow.insertCell(2).innerHTML = members;
    newRow.insertCell(3).innerHTML = "<a href='" + url + "'>" + url + "</a>";
    newRow.insertCell(4).innerHTML = category;
    newRow.insertCell(5).innerHTML = type;
    newRow.insertCell(6).innerHTML = year;
    newRow.insertCell(7).innerHTML = tags;

    clearInputs();
};

function clearInputs() {
    document.getElementById("group-input").value = "";
    document.getElementById("song-name-input").value = "";
    document.getElementById("members-input").value = "";
    document.getElementById("url-input").value = "";
    document.getElementById("category-input").value = "";
    document.getElementById("type-input").value = "";
    document.getElementById("year-input").value = "";
    document.getElementById("tags-input").value = "";
};

function makeLink() {
    var table = document.getElementById("sheet");

    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (j === 3) {
                var url = col.textContent;
                col.innerHTML = "<a href='" + url + "'>" + url + "</a>";
            }
        }
    }

}

function toggleForm() {

    var coll = document.getElementById("collapse");
    var content = document.getElementById("song-form");

    content.classList.toggle("active");
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
};
    

function shuffle(array) {

    let currentIndex = array.length;
    while (currentIndex !== 0) {
        // Pick a remaining element
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element
        let temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;

    }

    return array;
}

function randomizeMembers() {

    const memTab = document.getElementById("member-table");
    const rows = memTab.querySelectorAll("tr");

    const memberName = document.getElementById("member-name");

    const mems = JSON.parse(sessionStorage.getItem("membersSelected"));

    sessionStorage.setItem("shuffledMems", JSON.stringify(shuffle(mems)));

    const shuffledMems = JSON.parse(sessionStorage.getItem("shuffledMems"));

    for (let i = 0; i < mems.length; i++) {

        const newRow = memTab.insertRow(-1);
        const newCell = newRow.insertCell(0);

        newCell.textContent = shuffledMems[i];
    }

    memberName.textContent = shuffledMems[0];

}

function clearMembers() {

    sessionStorage.clear();

    console.log("Session Storage Cleared");
}


let currentInt = 0;

function getSong() {

    const memTab = document.getElementById("member-table");   

    const searchInput = document.getElementById('input');
    const songName = document.getElementById('song-name');
    const songURL = document.getElementById('song-url');

    const memTable = document.getElementById("member-table");

    const memberName = document.getElementById("member-name");

    const shuffledMems = JSON.parse(sessionStorage.getItem("shuffledMems"));

    console.log("Current Int before: " + currentInt);

    const rows = memTable.querySelectorAll('tr');

    for (var i = 0, row; row = memTable.rows[i]; i++) {
        if (row.cells[0].textContent.toLowerCase() === memberName.textContent.toLowerCase()) {
            const newCell = row.insertCell(1);
            newCell.innerHTML = "<a href='" + songURL.textContent + "'>" + songName.textContent + "</a>";
        }
    }

    currentInt++;
    memberName.textContent = shuffledMems[currentInt];
    console.log("Current Int after: " + currentInt);
}

function openLinks() {
    const memTable = document.getElementById("member-table");
    const rows = memTable.querySelectorAll('tr');

    for (var i = memTable.rows.length - 1; i >= 0; i--) {
        const row = memTable.rows[i];
        if (row.cells[1]) {
            const link = row.cells[1].querySelector('a');
            if (link) {
                window.open(link.href, '_blank');
            }
        }
    }
}

//members google sheet

// Construct the URL for Google Sheets API v4
const memsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Members?key=${apiKey}`;

async function fetchMembers() {
    try {
        // Fetch data from Google Sheets API
        const response = await fetch(memsUrl);
        const data = await response.json();

        // Extract rows from the data
        const rows = data.values;

        // Get the table body element
        const tableBody = document.getElementById('members-sheet');

        // Loop through the rows (starting from row 1 to skip headers)
        for (let i = 1; i < rows?.length ?? 0; i++) {
            const row = document.createElement('tr');

            // Loop through each cell in the row and create a table cell for each
            rows[i].forEach(cell => {
                const cellElement = document.createElement('td');
                //cellElement.textContent = cell;
                cellElement.innerHTML = "<label for='member" + i + "'>" + cell + "</label><br/><input type='checkbox' id='member" + i + "' value='" + cell + "' autocomplete='off'/>";
                row.appendChild(cellElement);
            });

            // Append the row to the table
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching members sheet data:', error);
    }
}

if(document.title === "members") {
    // Call the function to fetch and display data
    document.addEventListener('DOMContentLoaded', fetchMembers);
}
else if(document.title === "song archive" || "index") {
    // Call the function to fetch and display data
    document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);
}

