import React from 'react';

function LoggedInName() {

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var userId = ud.id;
  var firstName = ud.firstName;
  var lastName = ud.lastName;

  const doLogout = event => {
    event.preventDefault();

    localStorage.removeItem("user_data")
    window.location.href = '/';

  };

  const goToMakeTrip = event => {
    event.preventDefault();

    // got to makeTripPanel, hide other trip panels
    document.getElementById("makeTripPanel").style.display = "block";
    document.getElementById("PendingPanel").style.display = "none";
    document.getElementById("ActivePanel").style.display = "none";
    document.getElementById("DeniedPanel").style.display = "none";
    document.getElementById("AllPanel").style.display = "none";

    // hide navbar
    document.getElementById("NavWrapper").style.display = "none";

  };


  return (
    <div id="loggedInDiv">
    <button type="button" id="logoutButton" class="buttons" onClick={doLogout}> Log Out </button>
      <span id="userName">Logged In As {firstName} {lastName}</span>
      <button type="button" id="makeTripButton" class="buttons" onClick={goToMakeTrip}> Make Trip </button>
    </div>
  );

};


export default LoggedInName;
