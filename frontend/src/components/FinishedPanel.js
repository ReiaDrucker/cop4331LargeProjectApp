import React, { useState } from 'react';
import useEffectAsync from '../components/useEffectAsync';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';
// admin is generally referred to as user (ex: user_data) and I'll be calling the users the admin oversees clients

function FinishedPanel() {
    var search = '';
    var res;
    var res2;

    //  password for token encryption
    var ePassword = "shhhhh";

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
        while (document.getElementById("FinTripList").hasChildNodes()) {
            document.getElementById("FinTripList").removeChild(document.getElementById("FinTripList").lastChild);
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
                // check the trip status
                var isApproved = res[i].isApproved;
                var isNew = res[i].isNew;

                if (!(isApproved === true && isNew === false)) {
                    continue;
                }

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
                var loc1 = res[i].startLocation;
                var loc2 = res[i].destination;
                var departTime = res[i].startTime;
                var arrivalTime = res[i].endTime;
                var reason = res[i].purpose;
                var reasonDen = res[i].comments;

                // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                var collButton = document.createElement("button");
                collButton.innerHTML = "COMPLETE: " + uID + "'s Trip to " + loc2;
                collButton.id = ID + "-coll";
                collButton.className = "collapsible";

                // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                var contentDiv = document.createElement("div");
                contentDiv.id = "" + ID;
                contentDiv.className = "content";

                // create the <p> for the content div
                var departTimeP = document.createElement("p");
                var arrivalTimeP = document.createElement("p");
                var reasonP = document.createElement("p");

                // fill <p>s with content from json
                departTimeP.innerHTML = "Depart Time: " + departTime;
                arrivalTimeP.innerHTML = "Arrival Time: " + arrivalTime;
                reasonP.innerHTML = "Reason For Trip: " + reason;

                // add the <p>s to the content div
                contentDiv.appendChild(departTimeP);
                contentDiv.appendChild(arrivalTimeP);
                contentDiv.appendChild(reasonP);

                // add collButton and contentDiv to TripList
                document.getElementById("FinTripList").appendChild(collButton);
                document.getElementById("FinTripList").appendChild(contentDiv);

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
    }, []); // only re-run when the search term changes

    // search trips using a specific term
    const searchFin = async event => {
        event.preventDefault();

        // Remove the old contact elements before the new ones are added
        while (document.getElementById("FinTripList").hasChildNodes()) {
            document.getElementById("FinTripList").removeChild(document.getElementById("FinTripList").lastChild);
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
                // check the trip status
                var isApproved = res[i].isApproved;
                var isNew = res[i].isNew;

                if (!(isApproved === true && isNew === false)) {
                    continue;
                }

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
                var loc1 = res[i].startLocation;
                var loc2 = res[i].destination;
                var departTime = res[i].startTime;
                var arrivalTime = res[i].endTime;
                var reason = res[i].purpose;
                var reasonDen = res[i].comments;

                // make new button for the collapsible component, and give it an ID that corresponds to the ID # of the trip request in the database ("#-coll")
                var collButton = document.createElement("button");
                collButton.innerHTML = "COMPLETE: " + uID + "'s Trip to " + loc2;
                collButton.id = ID + "-coll";
                collButton.className = "collapsible";

                // make new div for the content, and give it an ID that corresponds to the trip request ID in the database ("#")
                var contentDiv = document.createElement("div");
                contentDiv.id = "" + ID;
                contentDiv.className = "content";

                // create the <p> for the content div
                var departTimeP = document.createElement("p");
                var arrivalTimeP = document.createElement("p");
                var reasonP = document.createElement("p");

                // fill <p>s with content from json
                departTimeP.innerHTML = "Depart Time: " + departTime;
                arrivalTimeP.innerHTML = "Arrival Time: " + arrivalTime;
                reasonP.innerHTML = "Reason For Trip: " + reason;

                // add the <p>s to the content div
                contentDiv.appendChild(departTimeP);
                contentDiv.appendChild(arrivalTimeP);
                contentDiv.appendChild(reasonP);

                // add collButton and contentDiv to TripList
                document.getElementById("FinTripList").appendChild(collButton);
                document.getElementById("FinTripList").appendChild(contentDiv);

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
        <div id="FinishedPanel">
            <br />
            <div id="searchPanelFin" >

                <input type="text" id="searchFinText" placeholder="Search" ref={(c) => search = c} />
                <button type="button" id="searchFinButton" class="buttons" onClick={searchFin}> Search </button>
            </div>

            <div id="FinTripListDiv">
                <span id="finTripSearchResult"></span>
                <div id="FinTripList">

                </div>
            </div>

            <br /><br />

        </div>
    );
};


export default FinishedPanel;