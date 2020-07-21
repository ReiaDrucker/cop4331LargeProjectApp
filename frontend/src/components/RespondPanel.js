import React, { useState, useEffect } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';

function RespondPanel() {

    var reasonGiven;

    //  password for token encryption
    var ePassword = "shhhhh";

    const [approvalValue, setAppVal] = useState('');

    useEffect(() => {
        setAppVal("true");
    }, []);


    const doResponse = async event => {
        event.preventDefault();

        var _tei = localStorage.getItem('trip_edit_data');
        var tei = JSON.parse(_tei);
        var tID = tei.idToEdit;
        var uID = tei.uID;
        var aID = tei.aID;

        // alert(tID + " " + uID + " " + aID + " " + approvalValue + " " + reasonGiven.value);

        if (approvalValue === "true") {
            var js = '{"_id":"'
                + tID
                + '","newData":{'
                // + '"userId":"' 
                // + uID
                // + '","adminId":"'
                // + aID
                + '"isApproved":'
                + approvalValue
                + ',"isNew":' + true
                + ',"comments":"' + reasonGiven.value + '"}}';

            // alert(js);        
        }

        else {
            var js = '{"_id":"'
                + tID
                + '","newData":{'
                // + '"userId":"' 
                // + uID
                // + '","adminId":"'
                // + aID
                + '"isApproved":'
                + approvalValue
                + ',"isNew":' + false
                + ',"comments":"' + reasonGiven.value + '"}}';

            // alert(js);
        }


        try {
            var token = jwt.sign(js, ePassword);

            var tokenJSON = '{"token":"' + token + '"}';

            const response = await fetch(BASE_URL + 'api/editTrip',
                { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

            var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

            document.getElementById("RespondPanel").style.display = "none";
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

        document.getElementById("RespondPanel").style.display = "none";
        document.getElementById("PendingPanel").style.display = "block";

        // show navbar
        document.getElementById("NavWrapper").style.display = "block";
    }


    return (
        <div id="RespondPanel">
            <form onSubmit={doResponse}>
                <span id="res-inner-title">Respond to Trip Request</span><br /><br />
                <label id="resAppLabel">
                    Accept
                    <input type="radio" class="radio" id="resApprove" name="status" value="true" checked={approvalValue === "true"} onClick={() => setAppVal("true")} /><br />
                </label>

                <label id="resDenLabel">
                    Deny
                    <input type="radio" class="radio" id="resDeny" name="status" value="false" checked={approvalValue === "false"} onClick={() => setAppVal("false")} /><br />
                </label>
                <input type="text" id="resReason" placeholder="Reason" ref={(c) => reasonGiven = c} /><br />
                <button type="button" id="resSubmit" class="buttons" onClick={doResponse}>Send Response</button><br /><br />
                <button type="button" id="resCancel" class="buttons" onClick={goToPendingPanel}> Cancel </button><br />
            </form>
        </div>
    );
};

export default RespondPanel;