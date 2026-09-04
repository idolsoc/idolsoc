membersSelected = new Array();

function getMembers() {

    mems = new Array();

    var checks = document.querySelectorAll("input[type='checkbox']");

    for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            mems.push(checks[i].value);
        }
    }

    localStorage.setItem("membersSelected", JSON.stringify(mems));
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

// Call the function to fetch and display data
document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);


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
                    if (j === 3)
                    {
                    songURL.innerHTML = "<a href='" + row.cells[3].textContent + "'>" + row.cells[3].textContent + "</a>";
                    console.log(row.cells[3].textContent);
                    }
                }
            }
        }

    }

};

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

};

//collapse func

var coll = document.getElementsByClassName("collapse");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

//end collapse func

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

    const mems = JSON.parse(localStorage.getItem("membersSelected"));

    const shuffledMems = shuffle(mems);
     
    for (let i = 0; i < mems.length; i++) {

        const newRow = memTab.insertRow(-1);
        const newCell = newRow.insertCell(0);

        newCell.textContent = shuffledMems[i];   
    }
    
}

function clearMembers() {

    localStorage.clear();

    console.log("Local Storage Cleared");
}


