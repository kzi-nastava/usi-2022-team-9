// Globals
class User {
    constructor(data) {
        this.id = data["id"]
        this.firstName = data["firstName"];
        this.lastName = data["lastName"];
        this.email = data["email"];
        this.role = data["role"];
        if (this.role == "doctor") {
            this.specialization = data["specialization"];
            this.score = data["score"];
            this.freeDays = data["freeDays"];
            this.examinations = data["examinations"];
        } else if (this.role == "patient") {
            this.medicalRecord = data["medicalRecord"];
        }
    }
}
var user;

// Helpers
function getParamValue(name) {
    var location = decodeURI(window.location.toString());
    var index = location.indexOf("?") + 1;
    var subs = location.substring(index, location.length);
    var splitted = subs.split("&");

    for (var i = 0; i < splitted.length; i++) {
        var s = splitted[i].split("=");
        var pName = s[0];
        var pValue = s[1];
        if (pName == name)
            return pValue;
    }
}

function showWindow(key) {
    let s1 = document.getElementById("one");
    let s2 = document.getElementById("two");
    let s3 = document.getElementById("three");
    let s4 = document.getElementById("four");

    s1.classList.remove("active");
    s2.classList.remove("active");
    s3.classList.remove("active");
    s4.classList.remove("active");

    switch (key) {
        case 1: s1.classList.add("active"); break;
        case 2: s2.classList.add("active"); break;
        case 3: s3.classList.add("active"); break;
        case 4: s4.classList.add("active"); break;
    }

}

var main = document.getElementsByTagName("main")[0];
let id = getParamValue('id');

// POST - Renovation
function renovateRoom(key) {
    let prompt = document.getElementById("renovationPrompt");
    prompt.classList.remove("off");
    main.classList.add("hideMain");

    let form = document.getElementById("renovationForm");

    form.addEventListener('submit', function (e) {
        prompt.classList.add("off");
        main.classList.remove("hideMain");
        e.preventDefault();
        e.stopImmediatePropagation();
        postRequest = new XMLHttpRequest();

        postRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Selected room is schedule for renovation");
                } else {
                    alert("Error: Selected room cannot be renovated during this period");
                }
            }
        }

        let finalFrom = document.getElementById("fromRenovation").value;
        let finalTo = document.getElementById("toRenovation").value;
        let date = new Date();

        if (finalFrom.length == 10 && finalTo.length == 10 && finalFrom >= date.toISOString().split('T')[0] && finalTo > finalFrom) {
            postRequest.open('POST', 'https://localhost:7291/api/manager/renovations/' + key + "&" + finalFrom + "&" + finalTo);
            postRequest.send();
        } else {
            alert("Error: Dates were not entered correctly");
        }
    });
}

// PUT - Room
function updateRoom(key) {
    let prompt = document.getElementById("roomPrompt");
    prompt.classList.remove("off");
    main.classList.add("hideMain");
    let fN = document.getElementById("roomName");
    fN.setAttribute("placeholder", key);

    let form = document.getElementById("roomForm");

    form.addEventListener('submit', function (e) {
        prompt.classList.add("off");
        main.classList.remove("hideMain");
        e.preventDefault();
        e.stopImmediatePropagation();
        putRequest = new XMLHttpRequest();

        putRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Selected room was successfully updated");
                    setUpRooms();
                } else {
                    alert("Error: New informations are invalide");
                }
            }
        }

        let finalName = document.getElementById("roomName").value;
        let finalType = document.getElementById("roomType").value;

        if (finalName.length != 0 && finalType.length != 0) {
            putRequest.open('PUT', 'https://localhost:7291/api/manager/rooms/' + key);

            putRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            putRequest.send(JSON.stringify({ "name": finalName, "type": finalType }));
        } else {
            alert("Error: Name can't be empty!")
        }
    });
}

// DELETE - Room
function deleteRoom(key) {
    deleteRequest = new XMLHttpRequest();

    deleteRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                setUpRooms();
                alert("Selected room was successfully deleted");
            } else {
                alert("Error: Selected room couldn't be deleted");
            }
        }
    }

    deleteRequest.open('DELETE', 'https://localhost:7291/api/manager/rooms/' + key)
    deleteRequest.send();
}

// POST - Room
let createBtn = document.getElementById("addBtn");
createBtn.addEventListener("click", function (e) {
    let prompt = document.getElementById("createRoomPrompt");
    prompt.classList.remove("off");
    main.classList.add("hideMain");
    let fN = document.getElementById("createRoomName");
    fN.setAttribute("placeholder", key);

    let form = document.getElementById("createRoomForm");

    form.addEventListener('submit', function (e) {
        prompt.classList.add("off");
        main.classList.remove("hideMain");
        e.preventDefault();
        e.stopImmediatePropagation();
        postRequest = new XMLHttpRequest();

        postRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Room sucessfuly created");
                    setUpRooms();
                } else {
                    alert("Error: Entered room informations are invalid");
                }
            }
        }

        let finalName = document.getElementById("createRoomName").value;
        let finalType = document.getElementById("createRoomType").value;
        if (finalName.length != 0 && finalType.length != 0) {
            postRequest.open('POST', 'https://localhost:7291/api/manager/rooms');

            postRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            postRequest.send(JSON.stringify({ "name": finalName, "type": finalType }));
        } else {
            alert("Error: Name can't be empty!")
        }
    });
});

// Main

window.addEventListener("load", function () {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                user = new User(response);
                setUpMenu();
                setUpPage();
            }
        }
    }

    request.open('GET', 'https://localhost:7291/api/my/users/' + id);
    request.send();
});

function setUpMenu() {
    let menu = document.getElementById("mainMenu");
    menu.innerHTML += `
    <li id="option1" class="navbar__item">
        <a href="#" class="navbar__link"><i data-feather="log-in"></i><span>Room Management</span></a>
    </li>
    <li id="option2" class="navbar__item">
        <a href="#" class="navbar__link"><i data-feather="tool"></i><span>Equipment Management</span></a>
    </li>
    <li id="option3" class="navbar__item">
        <a href="#" class="navbar__link"><i data-feather="shield"></i><span>Drug Management</span></a>
    </li>
    <li id="option4" class="navbar__item">
        <a href="#" class="navbar__link"><i data-feather="file-text"></i><span>Polls</span></a>
    </li>
    `;
    feather.replace();

    let item1 = document.getElementById("option1");
    let item2 = document.getElementById("option2");
    let item3 = document.getElementById("option3");
    let item4 = document.getElementById("option4");

    item1.addEventListener('click', function (e) {
        showWindow(1);
    });
    item2.addEventListener('click', function (e) {
        showWindow(2);
    });
    item3.addEventListener('click', function (e) {
        showWindow(3);
    });
    item4.addEventListener('click', function (e) {
        showWindow(4);
    });
}

function setUpRooms() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                let table = document.getElementById("roomTable");
                table.innerHTML = "";
                for (let i in response) {
                    let room = response[i];
                    let newRow = document.createElement("tr");

                    let cName = document.createElement("td");
                    cName.innerText = room["name"];
                    let cType = document.createElement("td");
                    cType.innerText = room["type"];
                    let cRenovation = document.createElement("td");
                    cRenovation.innerText = room["inRenovation"];

                    let one = document.createElement("td");
                    let delBtn = document.createElement("button");
                    delBtn.innerHTML = '<i data-feather="trash"></i>';
                    delBtn.classList.add("delBtn");
                    delBtn.setAttribute("key", room.name);
                    delBtn.addEventListener('click', function (e) {
                        deleteRoom(this.getAttribute('key'));
                    });
                    one.appendChild(delBtn);

                    let two = document.createElement("td");
                    let putBtn = document.createElement("button");
                    putBtn.innerHTML = '<i data-feather="edit-2"></i>';
                    putBtn.classList.add("updateBtn");
                    putBtn.setAttribute("key", room["name"]);
                    putBtn.addEventListener('click', function (e) {
                        updateRoom(this.getAttribute('key'));
                    });
                    two.appendChild(putBtn);

                    let three = document.createElement("td");
                    let renovateBtn = document.createElement("button");
                    renovateBtn.innerHTML = '<i data-feather="refresh-ccw"></i>';;
                    renovateBtn.classList.add("renovateBtn");
                    renovateBtn.setAttribute("key", room["name"]);
                    renovateBtn.addEventListener('click', function (e) {
                        renovateRoom(this.getAttribute('key'));
                    });
                    three.appendChild(renovateBtn);

                    newRow.appendChild(cName);
                    newRow.appendChild(cType);
                    newRow.appendChild(cRenovation);
                    newRow.appendChild(one);
                    newRow.appendChild(two);
                    newRow.appendChild(three);
                    table.appendChild(newRow);
                    feather.replace();
                }
            }
        }
    }

    request.open('GET', 'https://localhost:7291/api/manager/rooms');
    request.send();
}

function setUpPage() {
    let hi = document.getElementById("hi");
    hi.innerText += user.firstName + " " + user.lastName;

    setUpRooms();
}