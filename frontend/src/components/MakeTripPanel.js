import React, { useState, useEffect } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25-app.herokuapp.com/';

function MakeTripPanel() {

    var startLocation;
    var destination;
    var purpose;
    var weather;
    var startTime;
    
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userName = ud.userName;

    //  password for token encryption
    var ePassword = "shhhhh";


    const doMakeTrip = async event => {
        event.preventDefault();


        var js = '{"userName":"' 
        + userName 
        + '","startLocation":"' 
        + startLocation.value 
        + '","destination":"' 
        + destination.value 
        + '","purpose":"' 
        + purpose.value 
        + '","weather":"'
        + weather.value 
        + '","startTime":"' 
        + startTime.value + '"}';


        try {

            var token = jwt.sign(js, ePassword);

            var tokenJSON = '{"token":"' + token + '"}';

            const response = await fetch(BASE_URL + 'api/makeTrip',
                { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

            var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

            // swap back to pending panel
            document.getElementById("makeTripPanel").style.display = "none";
            document.getElementById("PendingPanel").style.display = "block";

            // show navbar
            document.getElementById("NavWrapper").style.display = "block";

            window.location.reload();
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    }

    // swap back to pendingPanel
    const goToPendingPanel = event => {
        event.preventDefault();

        document.getElementById("makeTripPanel").style.display = "none";
        document.getElementById("PendingPanel").style.display = "block";

        // show navbar
        document.getElementById("NavWrapper").style.display = "block";
    }


    return (
        <div id="makeTripPanel">
            <form onSubmit={doMakeTrip}>
                <span id="res-inner-title">Create a Trip Request</span><br /><br />

                <input type="text" id="tripStartLoc" placeholder="Starting Location" ref={(c) => startLocation = c} /><br />
                <input type="text" id="tripDestination" placeholder="Destination" ref={(c) => destination = c} /><br />
                <input type="text" id="tripStartTime" placeholder="Start Time" ref={(c) => startTime = c} /><br />
                <input type="text" id="tripPurpose" placeholder="Trip Purpose" ref={(c) => purpose = c} /><br />
                <input type="text" id="tripWeather" placeholder="Weather Conditions" ref={(c) => weather = c} /><br />


                <button type="button" id="resSubmit" class="buttons" onClick={doMakeTrip}>Create Trip Request</button><br /><br />
                <button type="button" id="resCancel" class="buttons" onClick={goToPendingPanel}> Cancel </button><br />
            </form>
        </div>
    );
};

export default MakeTripPanel;
