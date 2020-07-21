import React, { useState } from 'react';
import useEffectAsync from '../components/useEffectAsync';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';
// admin is generally referred to as user (ex: user_data) and I'll be calling the users the admin oversees clients

function AllPanel() {
    var search = '';
    var res;
    var res2;

    //  password for token encryption
    var ePassword = "shhhhh";

    var doNotUse;

    const [message, setMessage] = useState('');
    const [searchResults, setResults] = useState('');
    const [tripList, setTripList] = useState('');

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);

    // TODO - depends on vars we have stored for admin, assuming we'll have some way to get the adminUser's clients
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var userName = ud.userName;

    // search for trips on page load
    useEffectAsync(async () => {

        // Remove the old contact elements before the new ones are added
        while (document.getElementById("AllTripList").hasChildNodes()) {
            document.getElementById("AllTripList").removeChild(document.getElementById("AllTripList").lastChild);
        }

        var js = '{"userName":"' + userName + '"}';

        try {
            var token = jwt.sign(js, ePassword);

            var tokenJSON = '{"token":"' + token + '"}';

            // build and send JSON
            let response = await fetch(BASE_URL + 'api/listTripsByAdmin',
                { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

            res = jwt.verify(JSON.parse(await response.text()).token, ePassword);
            res = res.Results;
        }

        catch (e) {
            alert(e.toString());
        }

        // check for null results
        if (typeof res !== 'undefined') {

            // after recieving results, select the ones we need and build their dropdowns
            for (var i = 0; i < res.length; i++) {

                // get user name of user who requested trip
                js = '{"Id":"' + res[i].userId + '"}';
                try {
                    var token = jwt.sign(js, ePassword);

                    var tokenJSON = '{"token":"' + token + '"}';

                    // build and send JSON
                    let response = await fetch(BASE_URL + 'api/getById',
                        { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

                    res2 = jwt.verify(JSON.parse(await response.text()).token, ePassword);
                }
                catch (e) {
                    alert(e.toString());
                }

                // trip vars (from user request) - (ID refers to the trip request's ID, uID refers to the ID of the user who requested the trip)
                var ID = res[i]._id;
                var uID = res2.userName;
                //var client = res[i].Client;           
                var loc1 = res[i].startLocation;
                var loc2 = res[i].destination;
                var departTime = res[i].startTime;
                var reason = res[i].purpose;
                var weather = res[i].weather;
                var reasonDen = res[i].comments;
                var arrivalTime = res[i].endTime;

                var userIDNUM = res[i].userId;  // TODO - SHOULD BE TEMP
                var adminIDNUM = res[i].adminId;  // TODO - SHOULD BE TEMP

                // instantiate variables
                var collButton = document.createElement("button");
                var contentDiv = document.createElement("div");

                // check the trip status
                var isApproved = res[i].isApproved;
                var isNew = res[i].isNew;

                // PENDING
                if (isApproved === false && isNew === true) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "TRIP REQUEST: From: " + loc1 + " - To: " + loc2;
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    var contentDiv = document.createElement("div");
                    contentDiv.id = ID + "-cont";
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var clientP = document.createElement("p");
                    var weatherP = document.createElement("p");
                    var departTimeP = document.createElement("p");
                    var reasonP = document.createElement("p");

                    // fill <p>s with content from json
                    clientP.innerHTML = "Request From: " + uID;
                    weatherP.innerHTML = "Weather Conditions: " + weather;
                    departTimeP.innerHTML = "Depart Time: " + departTime;
                    reasonP.innerHTML = "Reason For Trip: " + reason;

                    // add the <p>s to the content div
                    contentDiv.appendChild(clientP);
                    contentDiv.appendChild(weatherP);
                    contentDiv.appendChild(departTimeP);
                    contentDiv.appendChild(reasonP);

                    // add respond button to get to deny / accept panel                
                    var resButton = document.createElement("button");
                    resButton.type = "button";
                    resButton.id = ID;
                    resButton.className = "buttons";
                    resButton.innerHTML = "Respond to request";
                    resButton.addEventListener("click", function (e) {
                        // save id of trip to edit
                        var idInfo = { idToEdit: e.currentTarget.id, uID: userIDNUM, aID: adminIDNUM }  // TODO - SHOULD BE TEMP (uID and aID)
                        // alert(JSON.stringify(idInfo));
                        localStorage.setItem('trip_edit_data', JSON.stringify(idInfo));

                        // swap view to respond panel
                        document.getElementById("RespondPanel").style.display = "block";
                        document.getElementById("AllPanel").style.display = "none";

                        // hide navbar
                        document.getElementById("NavWrapper").style.display = "none";
                    });

                    // add respond button to content div
                    contentDiv.appendChild(document.createElement("br"));
                    contentDiv.appendChild(resButton);

                    // add collButton and contentDiv to TripList
                    document.getElementById("AllTripList").appendChild(collButton);
                    document.getElementById("AllTripList").appendChild(contentDiv);
                }

                // ACTIVE
                if (isApproved === true && isNew === true) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "ACTIVE: " + uID + "'s Trip to " + loc2;
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    contentDiv.id = "" + ID;
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var currentLocP = document.createElement("p");
                    var departTimeP = document.createElement("p");
                    var reasonP = document.createElement("p");

                    // fill <p>s with content from json
                    currentLocP.innerHTML = "Current Location: " + loc1;
                    departTimeP.innerHTML = "Depart Time: " + departTime;
                    reasonP.innerHTML = "Reason For Trip: " + reason;

                    // add the <p>s to the content div
                    contentDiv.appendChild(currentLocP);
                    contentDiv.appendChild(departTimeP);
                    contentDiv.appendChild(reasonP);
                }

                // // FINISHED
                // if (isApproved === true && isNew === false) {
                //     // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                //     collButton.innerHTML = "COMPLETE: " + uID + "'s Trip to " + loc2;
                //     collButton.id = ID + "-coll";
                //     collButton.className = "collapsible";

                //     // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                //     contentDiv.id = "" + ID;
                //     contentDiv.className = "content";

                //     // create the <p> for the content div
                //     var departTimeP = document.createElement("p");
                //     var arrivalTimeP = document.createElement("p");
                //     var reasonP = document.createElement("p");

                //     // fill <p>s with content from json
                //     departTimeP.innerHTML = "Depart Time: " + departTime;
                //     arrivalTimeP.innerHTML = "Arrival Time: " + arrivalTime;
                //     reasonP.innerHTML = "Reason For Trip: " + reason;

                //     // add the <p>s to the content div
                //     contentDiv.appendChild(departTimeP);
                //     contentDiv.appendChild(arrivalTimeP);
                //     contentDiv.appendChild(reasonP);
                // }

                // DENIED
                if (isApproved === false && isNew === false) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "DENIED: " + uID + "'s Trip to " + loc2;
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    contentDiv.id = "" + ID;
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var reasonDenP = document.createElement("p");

                    // fill <p>s with content from json
                    reasonDenP.innerHTML = "Reason For Denial: " + reasonDen;

                    // add the <p>s to the content div
                    contentDiv.appendChild(reasonDenP);
                }

                // add collButton and contentDiv to TripList
                document.getElementById("AllTripList").appendChild(collButton);
                document.getElementById("AllTripList").appendChild(contentDiv);

                // add event listener
                collButton.addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    }
                    else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                })
            }
        }
    }, []); // do not re-run



    // add specific search
    const searchAll = async event => {
        event.preventDefault();

        // Remove the old contact elements before the new ones are added
        while (document.getElementById("AllTripList").hasChildNodes()) {
            document.getElementById("AllTripList").removeChild(document.getElementById("AllTripList").lastChild);
        }

        var js = '{"userName":"' + userName + '"}';

        try {
            var token = jwt.sign(js, ePassword);

            var tokenJSON = '{"token":"' + token + '"}';

            // build and send JSON
            let response = await fetch(BASE_URL + 'api/listTripsByAdmin',
                { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

            res = jwt.verify(JSON.parse(await response.text()).token, ePassword);
            res = res.Results;
        }

        catch (e) {
            alert(e.toString());
        }

        // check for null results
        // check for null results
        if (typeof res !== 'undefined') {

            // after recieving results, select the ones we need and build their dropdowns
            for (var i = 0; i < res.length; i++) {

                // get user name of user who requested trip
                js = '{"Id":"' + res[i].userId + '"}';
                try {
                    var token = jwt.sign(js, ePassword);

                    var tokenJSON = '{"token":"' + token + '"}';

                    // build and send JSON
                    let response = await fetch(BASE_URL + 'api/getById',
                        { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

                    res2 = jwt.verify(JSON.parse(await response.text()).token, ePassword);
                }
                catch (e) {
                    alert(e.toString());
                }

                // TODO - add search by search var, and possibly add multiple types of searches~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                if (search !== "" && res2.userName.indexOf(search.value) === -1) {
                    continue;
                }


                // trip vars (from user request) - (ID refers to the trip request's ID, uID refers to the ID of the user who requested the trip)
                var ID = res[i]._id;
                var uID = res2.userName;
                //var client = res[i].Client;
                var loc1 = res[i].startLocation;
                var loc2 = res[i].destination;
                var departTime = res[i].startTime;
                var reason = res[i].purpose;
                var weather = res[i].weather;
                var reasonDen = res[i].comments;
                var arrivalTime = res[i].endTime;

                var userIDNUM = res[i].userId;  // TODO - SHOULD BE TEMP
                var adminIDNUM = res[i].adminId;  // TODO - SHOULD BE TEMP

                // instantiate variables
                var collButton = document.createElement("button");
                var contentDiv = document.createElement("div");

                // check the trip status
                var isApproved = res[i].isApproved;
                var isNew = res[i].isNew;

                // PENDING
                if (isApproved === false && isNew === true) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "TRIP REQUEST: From: " + loc1 + " - To: " + loc2;
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    var contentDiv = document.createElement("div");
                    contentDiv.id = ID + "-cont";
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var clientP = document.createElement("p");
                    var weatherP = document.createElement("p");
                    var departTimeP = document.createElement("p");
                    var reasonP = document.createElement("p");

                    // fill <p>s with content from json
                    clientP.innerHTML = "Request From: " + uID;
                    weatherP.innerHTML = "Weather Conditions: " + weather;
                    departTimeP.innerHTML = "Depart Time: " + departTime;
                    reasonP.innerHTML = "Reason For Trip: " + reason;

                    // add the <p>s to the content div
                    contentDiv.appendChild(clientP);
                    contentDiv.appendChild(weatherP);
                    contentDiv.appendChild(departTimeP);
                    contentDiv.appendChild(reasonP);

                    // add respond button to get to deny / accept panel                
                    var resButton = document.createElement("button");
                    resButton.type = "button";
                    resButton.id = ID;
                    resButton.className = "buttons";
                    resButton.innerHTML = "Respond to request";
                    resButton.addEventListener("click", function (e) {
                        // save id of trip to edit
                        var idInfo = { idToEdit: e.currentTarget.id, uID: userIDNUM, aID: adminIDNUM }  // TODO - SHOULD BE TEMP (uID and aID)
                        // alert(JSON.stringify(idInfo));
                        localStorage.setItem('trip_edit_data', JSON.stringify(idInfo));

                        // swap view to respond panel
                        document.getElementById("RespondPanel").style.display = "block";
                        document.getElementById("AllPanel").style.display = "none";

                        // hide navbar
                        document.getElementById("NavWrapper").style.display = "none";
                    });

                    // add respond button to content div
                    contentDiv.appendChild(document.createElement("br"));
                    contentDiv.appendChild(resButton);

                    // add collButton and contentDiv to TripList
                    document.getElementById("AllTripList").appendChild(collButton);
                    document.getElementById("AllTripList").appendChild(contentDiv);
                }

                // ACTIVE
                if (isApproved === true && isNew === true) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "ACTIVE: " + uID + "'s Trip to " + loc2
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    contentDiv.id = "" + ID;
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var currentLocP = document.createElement("p");
                    var departTimeP = document.createElement("p");
                    var reasonP = document.createElement("p");

                    // fill <p>s with content from json
                    currentLocP.innerHTML = "Current Location: " + loc1;
                    departTimeP.innerHTML = "Depart Time: " + departTime;
                    reasonP.innerHTML = "Reason For Trip: " + reason;

                    // add the <p>s to the content div
                    contentDiv.appendChild(currentLocP);
                    contentDiv.appendChild(departTimeP);
                    contentDiv.appendChild(reasonP);
                }

                // // FINISHED
                // if (isApproved === true && isNew === false) {
                //     // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                //     collButton.innerHTML = "COMPLETE: " + uID + "'s Trip to " + loc2;
                //     collButton.id = ID + "-coll";
                //     collButton.className = "collapsible";

                //     // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                //     contentDiv.id = "" + ID;
                //     contentDiv.className = "content";

                //     // create the <p> for the content div
                //     var departTimeP = document.createElement("p");
                //     var arrivalTimeP = document.createElement("p");
                //     var reasonP = document.createElement("p");

                //     // fill <p>s with content from json
                //     departTimeP.innerHTML = "Depart Time: " + departTime;
                //     arrivalTimeP.innerHTML = "Arrival Time: " + arrivalTime;
                //     reasonP.innerHTML = "Reason For Trip: " + reason;

                //     // add the <p>s to the content div
                //     contentDiv.appendChild(departTimeP);
                //     contentDiv.appendChild(arrivalTimeP);
                //     contentDiv.appendChild(reasonP);
                // }

                // DENIED
                if (isApproved === false && isNew === false) {
                    // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                    collButton.innerHTML = "DENIED: " + uID + "'s Trip to " + loc2;
                    collButton.id = ID + "-coll";
                    collButton.className = "collapsible";

                    // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                    contentDiv.id = "" + ID;
                    contentDiv.className = "content";

                    // create the <p> for the content div
                    var reasonDenP = document.createElement("p");

                    // fill <p>s with content from json
                    reasonDenP.innerHTML = "Reason For Denial: " + reasonDen;

                    // add the <p>s to the content div
                    contentDiv.appendChild(reasonDenP);
                }

                // add collButton and contentDiv to TripList
                document.getElementById("AllTripList").appendChild(collButton);
                document.getElementById("AllTripList").appendChild(contentDiv);

                // add event listener
                collButton.addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    }
                    else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                })
            }
        }
    }


    return (
        <div id="AllPanel">
            <br />
            <div id="searchPanelAll" >

                <input type="text" id="searchAllText" placeholder="Search" ref={(c) => search = c} />
                <button type="button" id="searchAllButton" class="buttons" onClick={searchAll}> Search </button>
            </div>

            <div id="AllTripListDiv">
                <span id="allTripSearchResult"></span>
                <div id="AllTripList">

                </div>
            </div>

            <br /><br />

        </div>
    );
};


export default AllPanel;