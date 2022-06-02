var currentMedicalRecord;
var currentPatientMedicalRecord;
var currentExamination;
var roomOfExamination;

function setUpExaminations() {

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                doctorsExaminations = JSON.parse(this.responseText);
                setUpFunctionality();
            }
        }
    }

    request.open('GET', 'https://localhost:7291/api/examination/doctor/' + userId);
    request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    request.send();
}

function setUpFunctionality() {
    displayExaminations();
    document.getElementById('scheduleDate').value = (new Date()).toDateString;
    document.getElementById('scheduleDateOption').value = new Date().toISOString().split('T')[0];
    searchSchedule();
    setUpDrugsForReview();
}

function displayExaminations() {
    let table = document.getElementById('examinationsTable');
    table.innerHTML = "";
    for (let examination of doctorsExaminations) {

        let newRow = document.createElement("tr");

        let examinationDate = document.createElement("td");
        examinationDate.innerText = (new Date(examination["date"])).toLocaleString();
        let examinationDone = document.createElement("td");
        examinationDone.innerText = examination["done"];
        let examinationDuration = document.createElement("td");
        examinationDuration.innerText = examination["duration"];
        let examinationRoom = document.createElement("td");
        examinationRoom.innerText = examination["room"];
        let examinationType = document.createElement("td");
        examinationType.innerText = examination["type"];
        let isUrgent = document.createElement("td");
        isUrgent.innerText = examination["urgent"];

        let one = document.createElement("td");
        let patientBtn = document.createElement("button");
        patientBtn.innerHTML = '<i data-feather="user"></i>';
        patientBtn.setAttribute("key", examination["patient"]);
        patientBtn.classList.add('send');
        patientBtn.addEventListener('click', function (e) {
            window.location.replace("patientMedicalCard.php" + "?patientId=" + patientBtn.getAttribute("key") + '&token=' + jwtoken + '&doctorId=' + userId);
        });
        one.appendChild(patientBtn);

        let two = document.createElement("td");
        let reportBtn = document.createElement("button");
        reportBtn.innerHTML = '<i data-feather="clipboard"></i>';
        reportBtn.setAttribute("key", examination["id"]);
        reportBtn.classList.add('send');
        reportBtn.addEventListener('click', function (e) {
            reviewReport(parseInt(reportBtn.getAttribute('key')));
        });
        two.appendChild(reportBtn);

        let three = document.createElement("td");
        let delBtn = document.createElement("button");
        delBtn.innerHTML = '<i data-feather="trash"></i>';
        delBtn.classList.add("delBtn");
        delBtn.setAttribute("key", examination["id"]);
        delBtn.addEventListener('click', function (e) {
            deleteExamination(delBtn.getAttribute('key'));
        });
        three.appendChild(delBtn);

        let four = document.createElement("td");
        let updateBtn = document.createElement("button");
        updateBtn.innerHTML = '<i data-feather="upload"></i>';
        updateBtn.classList.add("updateBtn");
        updateBtn.setAttribute("key", examination["id"]);
        updateBtn.addEventListener('click', function (e) {
            updateExamination(updateBtn.getAttribute("key"));
        });
        four.appendChild(updateBtn);

        newRow.appendChild(examinationDate);
        newRow.appendChild(examinationDuration);
        newRow.appendChild(examinationDone);
        newRow.appendChild(examinationRoom);
        newRow.appendChild(examinationType);
        newRow.appendChild(isUrgent);
        newRow.appendChild(one);
        newRow.appendChild(two);
        newRow.appendChild(three);
        newRow.appendChild(four);
        table.appendChild(newRow);
        feather.replace();
    }
}

function reviewExamination(id) {
    for (let examination of doctorsExaminations) {
        if (examination["id"] == id) {
            currentExamination = examination;
            break;
        }
    }

    if (currentExamination['done'] != true) {
        let popUp = document.getElementById('reviewExaminationDiv');
        popUp.classList.remove("off");
        main.classList.add("hideMain");

        document.getElementById("reportDescription").innerText = currentExamination['anamnesis'];

        if (currentExamination['type'] == "operation") {
            let getEquipmentRequest = new XMLHttpRequest();
            getEquipmentRequest.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        let equipmentDiv = document.getElementById('equipmentDiv');
                        roomOfExamination = JSON.parse(this.responseText);
                        equipmentDiv.innerHTML = '';
                        for (let equipment of roomOfExamination['equipment']) {
                            let equipmentField = document.createElement('p');
                            equipmentField.innerText = `${equipment['name']} ( quantity: ${equipment['quantity']} )`;
                            equipmentField.setAttribute('equipmentType', equipment['type'])
                            equipmentField.classList.add('pushLeft');
                            let quantityField = document.createElement('input');
                            quantityField.setAttribute('type', 'text');
                            quantityField.setAttribute('autocomplete', 'off')
                            quantityField.setAttribute('placeholder', 'Enter how much to transfer');
                            equipmentDiv.appendChild(equipmentField);
                            equipmentDiv.appendChild(quantityField);
                        }
                    }
                }
            }
            getEquipmentRequest.open('GET', 'https://localhost:7291/api/room/' + currentExamination['room']);
            getEquipmentRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            getEquipmentRequest.send();
        }
        feather.replace();

        let getMedicalRecordRequest = new XMLHttpRequest();

        getMedicalRecordRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let patient = JSON.parse(this.responseText);
                    currentPatientMedicalRecord = patient;
                    currentMedicalRecord = patient["medicalRecord"];

                    let patientFName = document.getElementById("patientFName");
                    patientFName.setAttribute('id', 'patientId')
                    patientFName.setAttribute('key', patient['id']);
                    patientFName.innerText = patient["firstName"];
                    let patientLName = document.getElementById("patientLName");
                    patientLName.innerText = patient["lastName"];
                    let patientHeight = document.getElementById("patientHeight");
                    patientHeight.value = patient["medicalRecord"]["height"];
                    let patientWeight = document.getElementById("patientWeight");
                    patientWeight.value = patient["medicalRecord"]["weight"];
                    let patientBlood = document.getElementById("patientBlood");
                    patientBlood.value = patient["medicalRecord"]["bloodType"];
                    let patientDiseases = document.getElementById("diseasesList");
                    for (let disease of currentMedicalRecord['diseases']) {
                        let diseaseItem = document.createElement('option');
                        diseaseItem.innerText = disease;
                        patientDiseases.appendChild(diseaseItem);
                    }
                    let patientAlergies = document.getElementById("alergiesList");
                    for (let alergie of currentMedicalRecord['alergies']) {
                        let alergieItem = document.createElement('option');
                        alergieItem.innerText = alergie;
                        patientAlergies.appendChild(alergieItem);
                    }
                }
            }
        }
        getMedicalRecordRequest.open('GET', 'https://localhost:7291/api/MedicalCard/' + currentExamination['patient']);
        getMedicalRecordRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        getMedicalRecordRequest.send();
    } else {
        alert('Examination already reviewed.');
    }
}

var updateMedicalCardBtn = document.getElementById("updateMedicalCard");
updateMedicalCardBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    currentMedicalRecord['weight'] = document.getElementById('patientWeight').value;
    currentMedicalRecord['height'] = document.getElementById('patientHeight').value;
    currentMedicalRecord['bloodType'] = document.getElementById('patientBlood').value;
    currentPatientMedicalRecord['medicalRecord'] = currentMedicalRecord;

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Record updated")
            }
        }
    }
    request.open('PUT', 'https://localhost:7291/api/doctor/medicalrecord/' + currentPatientMedicalRecord['id']);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    request.send(JSON.stringify(currentMedicalRecord));
})

function reviewReport(id) {
    let currentExamination;
    for (let examination of doctorsExaminations) {
        if (examination["id"] == id) {
            currentExamination = examination;
            break;
        }
    }

    let popUp = document.getElementById('reportPopUpNew');

    popUp.classList.remove('off');
    main.classList.add('hideMain');

    if (currentExamination['anamnesis'] == "") {
        popUp.classList.add('off');
        main.classList.remove('hideMain');
        alert("No report present");
    } else {

        document.getElementById("reportDescriptionNew").innerText = currentExamination['anamnesis'];
        let equipmentDiv = document.getElementById('reportEquipmentNew');
        removeAllChildNodes(equipmentDiv);
        if (currentExamination['type'] == "operation") {
            equipmentDiv.classList.add('divList');
            let equipmentList = document.createElement('ul');
            let title = document.createElement('h3');
            title.innerText = "Equipment used:";
            equipmentDiv.appendChild(title);
            for (let equipment of currentExamination['equipmentUsed']) {
                let item = document.createElement('li');
                item.innerText = equipment;
                equipmentList.appendChild(item);
            }
            equipmentDiv.appendChild(equipmentList);
            popUp.appendChild(equipmentDiv);
        }

    }
}

var scheduleDateButton = document.getElementById("scheduleDateBtn");

function searchSchedule() {
    let inputDate = document.getElementById("scheduleDateOption").value;

    // const convertedInputDate = new Date(inputDate);
    // const lastDayInSchedule = new Date(inputDate);
    // lastDayInSchedule.setDate(convertedInputDate.getDate() + 3).set;
    // convertedInputDate.setHours(7, 0, 0);
    // lastDayInSchedule.setHours(23, 0, 0);

    let table = document.getElementById("examinationsTableSchedule");
    removeAllChildNodes(table);

    let scheduleRequest = new XMLHttpRequest();
    scheduleRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                for (let i in response) {
                    let examination = response[i];
                    let newRow = document.createElement("tr");
        
                    let examinationDate = document.createElement("td");
                    examinationDate.innerText = (new Date(examination["date"])).toLocaleString();
                    let examinationDuration = document.createElement("td");
                    examinationDuration.innerText = examination["duration"];
                    let examinationDone = document.createElement("td");
                    examinationDone.innerText = examination["done"];
                    let examinationRoom = document.createElement("td");
                    examinationRoom.innerText = examination["room"];
                    let examinationType = document.createElement("td");
                    examinationType.innerText = examination["type"];
                    let isUrgent = document.createElement("td");
                    isUrgent.innerText = examination["urgent"];
        
                    let one = document.createElement("td");
                    let patientBtn = document.createElement("button");
                    patientBtn.innerHTML = '<i data-feather="user"></i>';
                    patientBtn.setAttribute("key", examination["patient"]);
                    patientBtn.classList.add('send');
                    patientBtn.addEventListener('click', function (e) {
                        window.location.replace("patientMedicalCard.php" + "?patientId=" + patientBtn.getAttribute("key") + '&token=' + jwtoken + '&doctorId=' + userId);
                    });
                    one.appendChild(patientBtn);
        
                    let two = document.createElement("td");
                    let reviewBtn = document.createElement("button");
                    reviewBtn.innerHTML = '<i data-feather="check-square"></i>';
                    reviewBtn.classList.add("add");
                    reviewBtn.setAttribute("key", examination["id"]);
                    reviewBtn.addEventListener('click', function (e) {
                        reviewExamination(parseInt(reviewBtn.getAttribute('key')));
                    });
                    two.appendChild(reviewBtn);
        
                    newRow.appendChild(examinationDate);
                    newRow.appendChild(examinationDuration);
                    newRow.appendChild(examinationDone);
                    newRow.appendChild(examinationRoom);
                    newRow.appendChild(examinationType);
                    newRow.appendChild(isUrgent);
                    newRow.appendChild(one);
                    newRow.appendChild(two);
                    table.appendChild(newRow);
                    feather.replace();
                }
            }
        }

        scheduleRequest.open('GET', 'https://localhost:7291/api/examination/doctorSchedule/' + doctorId);
        scheduleRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        scheduleRequest.send(JSON.stringify(inputDate));
    }

    // for (let i in doctorsExaminations) {

    //     let examinationDate = new Date(doctorsExaminations[i]['date']);
    //     if (examinationDate >= convertedInputDate && examinationDate <= lastDayInSchedule) {

    //         let examination = doctorsExaminations[i];
    //         let newRow = document.createElement("tr");

    //         let examinationDate = document.createElement("td");
    //         examinationDate.innerText = (new Date(examination["date"])).toLocaleString();
    //         let examinationDuration = document.createElement("td");
    //         examinationDuration.innerText = examination["duration"];
    //         let examinationDone = document.createElement("td");
    //         examinationDone.innerText = examination["done"];
    //         let examinationRoom = document.createElement("td");
    //         examinationRoom.innerText = examination["room"];
    //         let examinationType = document.createElement("td");
    //         examinationType.innerText = examination["type"];
    //         let isUrgent = document.createElement("td");
    //         isUrgent.innerText = examination["urgent"];

    //         let one = document.createElement("td");
    //         let patientBtn = document.createElement("button");
    //         patientBtn.innerHTML = '<i data-feather="user"></i>';
    //         patientBtn.setAttribute("key", examination["patient"]);
    //         patientBtn.classList.add('send');
    //         patientBtn.addEventListener('click', function (e) {
    //             window.location.replace("patientMedicalCard.php" + "?patientId=" + patientBtn.getAttribute("key") + '&token=' + jwtoken + '&doctorId=' + userId);
    //         });
    //         one.appendChild(patientBtn);

    //         let two = document.createElement("td");
    //         let reviewBtn = document.createElement("button");
    //         reviewBtn.innerHTML = '<i data-feather="check-square"></i>';
    //         reviewBtn.classList.add("add");
    //         reviewBtn.setAttribute("key", examination["id"]);
    //         reviewBtn.addEventListener('click', function (e) {
    //             reviewExamination(parseInt(reviewBtn.getAttribute('key')));
    //         });
    //         two.appendChild(reviewBtn);

    //         newRow.appendChild(examinationDate);
    //         newRow.appendChild(examinationDuration);
    //         newRow.appendChild(examinationDone);
    //         newRow.appendChild(examinationRoom);
    //         newRow.appendChild(examinationType);
    //         newRow.appendChild(isUrgent);
    //         newRow.appendChild(one);
    //         newRow.appendChild(two);
    //         table.appendChild(newRow);
    //         feather.replace();
    //     }
    // }
}

scheduleDateButton.addEventListener("click", function (e) {
    searchSchedule();
});

function deleteExamination(id) {
    let deleteRequest = new XMLHttpRequest();
    deleteRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Examination has been successfully deleted");
                setUpExaminations();
            }
            else {
                alert("Error: Selected examination couldn't be deleted");
            }
        }
    }
    deleteRequest.open('DELETE', 'https://localhost:7291/api/examination/' + id);
    deleteRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    deleteRequest.send();
};

function validateTimeOfExamination(date, duration) {

    let currentDate = new Date();
    let newExaminationBegging = new Date(date);
    let newExaminationEnding = new Date(date);

    newExaminationEnding.setTime(newExaminationBegging.getTime() + 6000 * duration);

    if (currentDate > newExaminationBegging) {
        return false;
    }

    for (let examination of doctorsExaminations) {

        let examinationBegging = new Date(examination["date"]);
        let examinationEnding = new Date(examination["date"]);
        examinationEnding.setTime(examinationBegging.getTime() + 6000 * examination["duration"]);

        if ((newExaminationBegging >= examinationBegging && newExaminationBegging <= examinationEnding)
            | (newExaminationEnding >= examinationBegging && newExaminationEnding <= examinationEnding)) {
            return false;
        }
    }

    return true;
}

function validateTimeOfExaminationPut(date, duration, id) {

    let currentDate = new Date();
    let newExaminationBegging = new Date(date);
    let newExaminationEnding = new Date(date);

    newExaminationEnding.setTime(newExaminationBegging.getTime() + 60000 * duration);

    if (currentDate > newExaminationBegging) {
        return false;
    }

    for (let examination of doctorsExaminations) {
        if (examination["id"] != id) {

            let examinationBegging = new Date(examination["date"]);
            let examinationEnding = new Date(examination["date"]);
            examinationEnding.setTime(examinationBegging.getTime() + 60000 * examination["duration"]);

            if ((newExaminationBegging >= examinationBegging && newExaminationBegging <= examinationEnding)
                | (newExaminationEnding >= examinationBegging && newExaminationEnding <= examinationEnding)) {
                return false;
            }
        }
    }

    return true;
}

function submitForm(e) {
    let popUp = document.getElementById("examinationPopUp");
    popUp.classList.add("off");
    main.classList.remove("hideMain");
    e.preventDefault();
    e.stopImmediatePropagation();

    let selectedType = document.getElementById("examinationType").value;
    let selectedDate = document.getElementById("scheduleDate").value;
    let selectedDuration = document.getElementById("examinationDuration").value;

    if (validateTimeOfExamination(selectedDate, selectedDuration)
        && !(selectedType == "visit" && selectedDuration != 15)) {

        let postRequest = new XMLHttpRequest();

        postRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Examination sucessfuly created");
                    setUpExaminations();
                } else {
                    alert("Error: Entered examination informations are invalid");
                }
            }
        };

        let selectedRoom = document.getElementById("examinationRoom").value;
        let selectedPatient = document.getElementById("examinationPatient").value;
        let isUrgent = document.getElementById("urgent").checked ? true : false;

        postRequest.open('POST', 'https://localhost:7291/api/examination/new');
        postRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        postRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        postRequest.send(JSON.stringify({ "done": false, "date": selectedDate, "duration": selectedDuration, "room": selectedRoom, "patient": selectedPatient, "doctor": userId, "urgent": isUrgent, "type": selectedType, "anamnesis": "" }));
    }
    else {
        alert("Error: Entered examination informations are invalid");
    }
}

var rooms;

function addOptions(element, roomOptions) {
    let valueOfType = element.value;
    if (valueOfType == "visit") {
        for (let room of rooms) {
            if (room["type"] == "examination room") {
                let newOption = document.createElement('option');
                newOption.setAttribute('value', room['name']);
                newOption.innerText = room['name'];
                roomOptions.appendChild(newOption);
            }
        }
    } else {
        for (let room of rooms) {
            if (room["type"] == "operation room") {
                let newOption = document.createElement('option');
                newOption.setAttribute('value', room['name']);
                newOption.innerText = room['name'];
                roomOptions.appendChild(newOption);
            }
        }
    }
}

function createExamination() {
    let getRequest = new XMLHttpRequest();
    getRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                rooms = JSON.parse(this.responseText);
                let popUp = document.getElementById("examinationPopUp");
                popUp.classList.remove("off");
                main.classList.add("hideMain");

                document.getElementById("examinationDuration").value = 15;
                document.getElementById("examinationPatient").value = "";
                document.getElementById("urgent").checked = false;

                let form = document.getElementById("examinationForm");
                let title = document.getElementById("examinationFormId");
                title.innerText = "Create examination";

                let roomOptions = document.getElementById("examinationRoom");
                let examinationType = document.getElementById("examinationType");
                addOptions(examinationType, roomOptions);
                examinationType.addEventListener('change', function (e) {
                    removeAllChildNodes(roomOptions);
                    addOptions(examinationType, roomOptions);
                })

                form.addEventListener('submit', function (e) {
                    submitForm(e)
                });
            }
        }
    }
    getRequest.open('GET', 'https://localhost:7291/api/room/all');
    getRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    getRequest.send();
}

function submitUpdate(e, updatedExamination, id) {
    let popUp = document.getElementById('examinationPopUp');
    popUp.classList.add("off");
    main.classList.remove("hideMain");
    e.preventDefault();
    e.stopImmediatePropagation();

    let selectedType = document.getElementById("examinationType").value;
    let selectedDate = document.getElementById("scheduleDate").value;
    let selectedDuration = document.getElementById("examinationDuration").value;
    if (validateTimeOfExaminationPut(selectedDate, selectedDuration, id)
        && !(selectedType == "visit" && selectedDuration != 15)) {

        let postRequest = new XMLHttpRequest();

        postRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Examination sucessfuly updated");
                    setUpExaminations();
                } else {
                    alert("Error: Entered examination informations are invalid");
                }
            }
        };

        let selectedRoom = document.getElementById("examinationRoom").value;
        let selectedPatient = document.getElementById("examinationPatient").value;
        let isUrgent = document.getElementById("urgent").checked ? true : false;

        postRequest.open('PUT', 'https://localhost:7291/api/examination/update/' + id);
        postRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        postRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        postRequest.send(JSON.stringify({ "_id": updatedExamination["_id"], "id": updatedExamination["id"], "done": false, "date": selectedDate, "duration": selectedDuration, "room": selectedRoom, "patient": selectedPatient, "doctor": userId, "urgent": isUrgent, "type": selectedType, "anamnesis": "" }));
    }
    else {
        alert("Error: Entered examination informations are invalid");
        popUp.classList.remove("off");
        main.classList.add("hideMain");
        let title = document.getElementById("examinationFormId");
        title.innerText = "Update examination"
    }
}

function updateExamination(id) {
    let getRequest = new XMLHttpRequest();
    getRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                rooms = JSON.parse(this.responseText);
                let updatedExamination;
                for (let examination of doctorsExaminations) {
                    if (examination.id == id) {
                        updatedExamination = examination;
                        break
                    }
                }

                let popUp = document.getElementById("examinationPopUp");
                popUp.classList.remove("off");
                main.classList.add("hideMain");
                let title = document.getElementById("examinationFormId");
                title.innerText = "Update examination";

                let form = document.getElementById("examinationForm");
                document.getElementById("scheduleDate").value = updatedExamination["date"];
                document.getElementById("examinationDuration").value = updatedExamination["duration"];
                document.getElementById("examinationPatient").value = updatedExamination["patient"];
                document.getElementById("examinationType").value = updatedExamination["type"];
                document.getElementById("urgent").checked = false;
                if (updatedExamination["urgent"]) {
                    document.getElementById("urgent").checked = true;
                }

                let roomOptions = document.getElementById("examinationRoom");
                let examinationType = document.getElementById("examinationType");
                addOptions(examinationType, roomOptions);
                examinationType.addEventListener('change', function (e) {
                    removeAllChildNodes(roomOptions);
                    addOptions(examinationType, roomOptions);
                })

                form.addEventListener('submit', function (e) {
                    submitUpdate(e, updatedExamination, id);
                });
            }
        }
    }
    getRequest.open('GET', 'https://localhost:7291/api/room/all');
    getRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    getRequest.send();
}

var createBtn = document.getElementById("addBtn");

createBtn.addEventListener("click", createExamination);

var closeReportBtn = document.getElementById('closeReportBtn');

closeReportBtn.addEventListener('click', function (e) {
    let equipment = document.getElementById('reportEquipment');
    removeAllChildNodes(equipment);

    let popUp = document.getElementById('reportPopUpNew');

    popUp.classList.add('off');
    main.classList.remove('hideMain');
})

var diseaseDelBtn = document.getElementById('deleteDiseases');

diseaseDelBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let diseases = document.getElementById('diseasesList');
    let deletedDiseases = diseases.value;
    currentMedicalRecord["diseases"] = currentMedicalRecord["diseases"].filter(function (item) {
        return item !== deletedDiseases
    });
    removeAllChildNodes(diseases);
    for (let disease of currentMedicalRecord['diseases']) {
        let diseaseItem = document.createElement('option');
        diseaseItem.innerText = disease;
        diseases.appendChild(diseaseItem);
    }
})

var alergiesDelBtn = document.getElementById('deleteAlergies');

alergiesDelBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let alergies = document.getElementById('alergiesList');
    let deletedAlergies = alergies.value;
    currentMedicalRecord["alergies"] = currentMedicalRecord["alergies"].filter(function (item) {
        return item !== deletedAlergies
    });
    removeAllChildNodes(alergies);
    for (let alergie of currentMedicalRecord['alergies']) {
        let alergieItem = document.createElement('option');
        alergieItem.innerText = alergie;
        alergies.appendChild(alergieItem);
    }
})

var diseaseAddBtn = document.getElementById('addDiseases');

diseaseAddBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let diseasesInput = document.getElementById('diseaseInput');
    let diseases = document.getElementById('diseasesList');
    let addedDiseases = diseasesInput.value;
    currentMedicalRecord["diseases"].push(addedDiseases);
    removeAllChildNodes(diseases);
    for (let disease of currentMedicalRecord['diseases']) {
        let diseaseItem = document.createElement('option');
        diseaseItem.innerText = disease;
        diseases.appendChild(diseaseItem);
    }
    diseasesInput.value = "";
})

var alergiesAddBtn = document.getElementById('addAlergies');

alergiesAddBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let alergiesInput = document.getElementById('alergieInput');
    let alergies = document.getElementById('alergiesList');
    let addedAlergies = alergiesInput.value;
    currentMedicalRecord["alergies"].push(addedAlergies);
    removeAllChildNodes(alergies);
    for (let alergie of currentMedicalRecord['alergies']) {
        let alergieItem = document.createElement('option');
        alergieItem.innerText = alergie;
        alergies.appendChild(alergieItem);
    }
    alergiesInput.value = "";
})

var endReviewBtn = document.getElementById('endReview');

endReviewBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    currentExamination['anamnesis'] = document.getElementById('reportDescription').value;
    let ok = true;
    let equipmentUsed = [];
    if (currentExamination['type'] == "operation") {
        let children = document.getElementById('equipmentDiv').children
        for (let i = 0; i < children.length; i += 2) {
            if (children[i + 1].value) {
                if (+children[i].innerText.split(' ')[3] >= +children[i + 1].value) {
                    let el = {
                        name: children[i].innerText.split(' ')[0],
                        type: children[i].getAttribute('equipmentType'),
                        quantity: children[i + 1].value
                    };
                    equipmentUsed.push(el);
                } else {
                    ok = false;
                    break;
                }
            }
        }
    }

    let reviewExaminationRequest = new XMLHttpRequest();
    reviewExaminationRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Successful review");
                searchSchedule();
            } else {
                alert("Bad review");
            }
        }
    }

    let roomRequest = new XMLHttpRequest();
    roomRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {

            }
        }
    }

    if (ok) {
        let popUp = document.getElementById('reviewExaminationDiv');
        popUp.classList.add('off');
        main.classList.remove('hideMain');
        if (currentExamination['type'] == 'operation') {
            for (let i in roomOfExamination['equipment']) {
                for (let equipmentInUse of equipmentUsed) {
                    if (roomOfExamination['equipment'][i]['name'] == equipmentInUse['name']) {
                        roomOfExamination['equipment'][i]['quantity'] -= +equipmentInUse['quantity'];
                    }
                }
            }

            let equipmenForExamination = []

            for (let equipmentItem of equipmentUsed) {
                equipmenForExamination.push(equipmentItem['name']);
            }
            currentExamination['equipmentUsed'] = equipmenForExamination;
            roomRequest.open('PUT', 'https://localhost:7291/api/room/' + roomOfExamination['name']);
            roomRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            roomRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            roomRequest.send(JSON.stringify({ "id": roomOfExamination["id"], "name": roomOfExamination["name"], "type": roomOfExamination["type"], "inRenovation": roomOfExamination["inRenovation"], "equipment": roomOfExamination["equipment"] }));
        } else {
            currentExamination['equipmentUsed'] = [];
        }
        for (let examination of doctorsExaminations) {
            if (examination["id"] == currentExamination['id']) {
                examination["done"] = true;
                break;
            }
        }
        reviewExaminationRequest.open('PUT', 'https://localhost:7291/api/examination/' + currentExamination['id']);
        reviewExaminationRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        reviewExaminationRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        reviewExaminationRequest.send(JSON.stringify({ "_id": currentExamination["_id"], "id": currentExamination["id"], "done": true, "date": currentExamination['date'], "duration": currentExamination['duration'], "room": currentExamination['room'], "patient": currentExamination['patient'], "doctor": currentExamination['doctor'], "urgent": currentExamination['urgent'], "type": currentExamination['type'], "anamnesis": currentExamination['anamnesis'], 'equipmentUsed': currentExamination['equipmentUsed'] }));

    } else {
        alert('Quantity inputed badly.');
    }
})

var drugs;
var percsriptionBtn = document.getElementById('prescribeReviews');

percsriptionBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let popUp = document.getElementById('reviewExaminationDiv');
    popUp.classList.add('off');

    let perscriptionPopUp = document.getElementById('perscriptionDiv');
    perscriptionPopUp.classList.remove('off');

    let getDrugsRequest = new XMLHttpRequest();
    getDrugsRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                drugs = JSON.parse(this.response);
                let drugOptions = document.getElementById('drugOptionsList');
                removeAllChildNodes(drugOptions);
                for (let drug of drugs) {
                    let drugItem = document.createElement('option');
                    drugItem.innerText = drug['name'];
                    drugOptions.appendChild(drugItem);
                }
                drugOptions.firstElementChild.setAttribute('selected', true);
                let percsriptionTime = document.getElementById('perscriptionTime');
                percsriptionTime.value = new Date().toISOString().split('T')[1].split('Z')[0];
            }
        }
    }

    getDrugsRequest.open('GET', 'https://localhost:7291/api/drug/all');
    getDrugsRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    getDrugsRequest.send();
})

var addpercsriptionBtn = document.getElementById('addPrescription');

addpercsriptionBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let drugOptions = document.getElementById('drugOptionsList');
    let pickedDrug = drugOptions.value;
    let drug = findDrug(pickedDrug);
    let answer = validationOfPrescription(drug);
    if (answer == "allergic") {
        alert('Patient is alergic to ingredients of this drug.');
    }
    else {
        if (answer == "modified") {
            modifyLastPerscription(pickedDrug);
            addMedicalInstruction(pickedDrug);
        }
        else {
            addPerscriptionToRecord(pickedDrug);
            addMedicalInstruction(pickedDrug);
        }

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Perscription added.")
                }
            }
        }

        request.open('PUT', 'https://localhost:7291/api/medicalrecord/' + currentPatientMedicalRecord['id']);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        request.send(JSON.stringify({}));
    }

    let perscriptionPopUp = document.getElementById('perscriptionDiv');
    perscriptionPopUp.classList.add('off');

    let popUp = document.getElementById('reviewExaminationDiv');
    popUp.classList.remove('off');
})

function validationOfPrescription(drug) {
    let patientAllergies = currentMedicalRecord["alergies"];
    let isAllergic = checkIfAllergicToIngredients(patientAllergies, drug['ingredients'], drug['name']);
    if (isAllergic) {
        return "allergic";
    } else if (checkIfDrugPerscribed(drug['name'])) {
        return "modified";
    } else {
        return "accepted";
    }
}

function findDrug(drugName) {
    for (let drug of drugs) {
        if (drug['name'] == drugName) {
            return drug;
        }
    }
    return NaN;
}

function checkIfDrugPerscribed(drugName) {
    for (let drug of currentMedicalRecord['drugs']) {
        if (drugName == drug['name']) {
            return true;
        }
    }
    return false;
}

function getDrugPerscribed(drugName) {
    for (let drug of currentMedicalRecord['drugs']) {
        if (drugName == drug['name']) {
            return drug;
        }
    }
    return Nan;
}

function checkIfAllergicToIngredients(allergies, ingredients, drugName) {
    if (allergies.includes(drugName)) {
        return true;
    }
    for (let ingredient of ingredients) {
        if (allergies.includes(ingredient)) {
            return true;
        }
    }
    return false;
}

function modifyLastPerscription(drugName) {
    let drugPerscription = getDrugPerscribed(drugName);
    let time = document.getElementById('perscriptionTime').value;
    drugPerscription['when'] = time;
    let frequency = document.getElementById('perscriptionFrequency').value;
    drugPerscription['frequency'] = frequency;
    let when = document.getElementById('perscriptionFrequency').value;
    drugPerscription['how'] = when;
}

function addMedicalInstruction(drugName) {
    let perscriptionDuration = document.getElementById('perscriptionDuration').value;
    let start = new Date();
    let end = new Date();
    end.setDate(start.getDate() + +perscriptionDuration).set;

    let convertedStart = start.toISOString().split('T')[0];
    let convertedEnd = end.toISOString().split('T')[0]
    let medicalInstruction = { 'startDate': convertedStart, 'endDate': convertedEnd, 'doctor': userId, 'drug': drugName };
    currentMedicalRecord['medicalInstructions'].push(medicalInstruction);
}

function addPerscriptionToRecord(drugName) {
    let time = document.getElementById('perscriptionTime').value;
    let frequency = document.getElementById('perscriptionFrequency').value;
    let how = document.getElementById('howList').value;

    let newPerscription = { 'name': drugName, 'when': time, 'how': how, 'frequency': frequency };
    currentMedicalRecord['drugs'].push(newPerscription);
}

var referallBtn = document.getElementById('createReferall');
var doctors;
var specialities;

referallBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let popUp = document.getElementById('reviewExaminationDiv');
    popUp.classList.add("off");
    let referallDiv = document.getElementById('referallDiv');
    referallDiv.classList.remove('off');
    getDoctors();
    let referallOption = document.getElementById('referallType');
    referallOption.addEventListener('change', function (e) {
        addReferallOptions();
    })
})

function getDoctors() {
    let getDoctorsRequest = new XMLHttpRequest();
    getDoctorsRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                doctors = [];
                doctors = doctors.concat((JSON.parse(this.response)));
                getSpecialities();
                addReferallOptions();
            }
        }
    }
    getDoctorsRequest.open('GET', 'https://localhost:7291/api/my/users/doctors');
    getDoctorsRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    getDoctorsRequest.send();
}

function getSpecialities() {
    specialities = [];
    for (let doctor of doctors) {
        if (!specialities.includes(doctor['specialization'])) {
            specialities.push(doctor['specialization']);
        }
    }
}

function addReferallOptions() {
    let valueOfReferallType = document.getElementById('referallType').value;
    let referallOptions = document.getElementById('referallOption');
    removeAllChildNodes(referallOptions);
    if (valueOfReferallType == "doctor") {
        for (let doctor of doctors) {
            let newOption = document.createElement('option');
            newOption.setAttribute('value', doctor['id']);
            newOption.innerText = doctor['firstName'] + " " + doctor['lastName'];
            referallOptions.appendChild(newOption);
        }
    } else {
        for (let speciality of specialities) {
            let newOption = document.createElement('option');
            newOption.setAttribute('value', speciality);
            newOption.innerText = speciality;
            referallOptions.appendChild(newOption);
        }
    }
    referallOptions.firstElementChild.setAttribute('selected', true);
}

let addReferallBtn = document.getElementById('addReferall');

addReferallBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let addReferallRequest = new XMLHttpRequest();
    addReferallRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Referral created");
            }
        }
    }
    let valueOfReferallType = document.getElementById('referallType').value;
    let referallOption = document.getElementById('referallOption').value;
    let referralNew;
    if (valueOfReferallType == 'doctor') {
        referralNew= { "doctorId": referallOption };
    }
    else {
        referralNew = { "speciality": referallOption };
    }

    addReferallRequest.open('PUT', 'https://localhost:7291/api/referral/' + currentPatientMedicalRecord['id']);
    addReferallRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    addReferallRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    addReferallRequest.send(JSON.stringify(referralNew));

    let referallDiv = document.getElementById('referallDiv');
    referallDiv.classList.add('off');
    let popUp = document.getElementById('reviewExaminationDiv');
    popUp.classList.remove("off");
})

function setUpDrugsForReview() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let reviewDrugs = JSON.parse(this.responseText);
                let table = document.getElementById('drugTable');
                table.innerHTML = '';
                for (let drug of reviewDrugs) {
                    let newRow = document.createElement('tr');

                    let tableDataName = document.createElement('td');
                    tableDataName.innerText = drug['name'];
                    let tableDataIngredients = document.createElement('td');
                    tableDataIngredients.innerText = '';
                    for (let ingredient of drug['ingredients']) {
                        tableDataIngredients.innerText += `${ingredient}, `;
                    }
                    if (tableDataIngredients.innerText.endsWith(', ')) {
                        tableDataIngredients.innerText = tableDataIngredients.innerText.slice(0, -2);
                    }

                    let tableSendBackButton = document.createElement('td');
                    let sendBackBtn = document.createElement('button');
                    sendBackBtn.innerHTML = `<i data-feather='edit-2'></i>`;
                    sendBackBtn.classList.add('updateBtn');
                    sendBackBtn.setAttribute('key', drug['name']);
                    sendBackBtn.addEventListener('click', function (e) {
                        sendBackDrug(sendBackBtn.getAttribute('key'));
                    });
                    tableSendBackButton.appendChild(sendBackBtn);

                    let tableDataApproveButton = document.createElement('td');
                    let approveBtn = document.createElement('button');
                    approveBtn.innerHTML = `<i data-feather='check'></i>`;
                    approveBtn.classList.add('add');
                    approveBtn.setAttribute('key', drug['name']);
                    approveBtn.addEventListener('click', function (e) {
                        approveDrug(this.getAttribute('key'));
                    });
                    tableDataApproveButton.appendChild(approveBtn);

                    newRow.appendChild(tableDataName);
                    newRow.appendChild(tableDataIngredients);
                    newRow.appendChild(tableSendBackButton);
                    newRow.appendChild(tableDataApproveButton);
                    table.appendChild(newRow);
                    feather.replace();
                }
            }
        }
    }

    request.open('GET', 'https://localhost:7291/api/drug/review');
    request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    request.send();
}

function sendBackDrug(key) {
    let sendBtn = document.getElementById('sendDrugMessage');
    sendBtn.setAttribute('key', key);
    sendBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let sendMessageRequest = new XMLHttpRequest();
        sendMessageRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let messageDiv = document.getElementById('messageDrugPrompt');
                    messageDiv.value = "";
                    messageDiv.classList.add('off');
                    main.classList.remove("hideMain");
                    alert('Message sent sucessfuly.');
                }
            }
        }
        let message = document.getElementById('drugReviewMessage').value;
        sendMessageRequest.open('PUT', 'https://localhost:7291/api/drug/message/' + key);
        sendMessageRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        sendMessageRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        sendMessageRequest.send(JSON.stringify({ "message": message }));
    })
    main.classList.add("hideMain");
    let messageDiv = document.getElementById('messageDrugPrompt');
    messageDiv.classList.remove('off');
}

function approveDrug(key) {
    let sendMessageRequest = new XMLHttpRequest();
    sendMessageRequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert('Drug approved sucessfuly.');
                location.reload();
                setUpDrugsForReview();
                showWindow(3);
            }
        }
    }
    sendMessageRequest.open('PUT', 'https://localhost:7291/api/drug/approve/' + key);
    sendMessageRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    sendMessageRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
    sendMessageRequest.send();
}

