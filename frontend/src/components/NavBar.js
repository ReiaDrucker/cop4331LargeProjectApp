import React, { useState } from 'react';

function NavBar() {
    // swap panel to pending trips
    const gotoPending = event => {
        event.preventDefault();

        document.getElementById("subTitle").innerHTML = "Pending Trips";

        document.getElementById("PendingPanel").style.display = "block";
        document.getElementById("ActivePanel").style.display = "none";
        // document.getElementById("FinishedPanel").style.display = "none";
        document.getElementById("DeniedPanel").style.display = "none";
        document.getElementById("AllPanel").style.display = "none";
    }

    // swap panel to active trips
    const gotoActive = event => {
        event.preventDefault();

        document.getElementById("subTitle").innerHTML = "Active Trips";

        document.getElementById("PendingPanel").style.display = "none";
        document.getElementById("ActivePanel").style.display = "block";
        // document.getElementById("FinishedPanel").style.display = "none";
        document.getElementById("DeniedPanel").style.display = "none";
        document.getElementById("AllPanel").style.display = "none";
    }

    // // swap panel to finished trips
    // const gotoFinished = event => {
    //     event.preventDefault();

    //     document.getElementById("subTitle").innerHTML = "Finished Trips";

    //     document.getElementById("PendingPanel").style.display = "none";
    //     document.getElementById("ActivePanel").style.display = "none";
    //     document.getElementById("FinishedPanel").style.display = "block";
    //     document.getElementById("DeniedPanel").style.display = "none";
    //     document.getElementById("AllPanel").style.display = "none";
    // }

    // swap panel to denied trips
    const gotoDenied = event => {
        event.preventDefault();

        document.getElementById("subTitle").innerHTML = "Denied Trips";

        document.getElementById("PendingPanel").style.display = "none";
        document.getElementById("ActivePanel").style.display = "none";
        // document.getElementById("FinishedPanel").style.display = "none";
        document.getElementById("DeniedPanel").style.display = "block";
        document.getElementById("AllPanel").style.display = "none";
    }

    // swap panel to all trips
    const gotoAll = event => {
        event.preventDefault();

        document.getElementById("subTitle").innerHTML = "All Trips";

        document.getElementById("PendingPanel").style.display = "none";
        document.getElementById("ActivePanel").style.display = "none";
        // document.getElementById("FinishedPanel").style.display = "none";
        document.getElementById("DeniedPanel").style.display = "none";
        document.getElementById("AllPanel").style.display = "block";
    }


    return (
        <div id="NavWrapper">
            <h2 id="subTitle">Pending Trips</h2>
            <div id="NavBarHolder">
                <div id="NavBar" class="topnav">
                    <button type="button" id="pendingButton" class="navButtons" onClick={gotoPending}> Pending Trips </button>
                    <button type="button" id="activeButton" class="navButtons" onClick={gotoActive}> Active Trips</button>
                    <button type="button" id="activeButton" class="navButtons" onClick={gotoDenied}> Denied Trips</button>
                    <button type="button" id="activeButton" class="navButtons" onClick={gotoAll}> All Trips</button>
                </div>
            </div>

        </div>


    );
};

export default NavBar;