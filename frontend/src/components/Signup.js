
import React, { useState } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25-app.herokuapp.com/';

function Signup() {

  var firstName;
  var lastName;
  var email;
  var userName;
  var password;
  var passwordConfirm;
  var admin;

  //  password for token encryption
  var ePassword = "shhhhh";

  const [message, setMessage] = useState('');


  const doSignup = async event => {
    event.preventDefault();

    // check confirm password
    if (password.value != passwordConfirm.value) {
      setMessage("Passwords do not match")
      return;
    }

    // check for invalid password / adminId
    if (password.value == null || password.value == "") {
      setMessage("Invalid password");
      return;
    }

    if (userName.value == null || userName.value == "") {
      setMessage("Invalid username");
      return;
    }

    // check that admin is valid
    try {
      const response = await fetch(BASE_URL + 'api/listAdmins',
        { method: 'POST' });

      // verify returned token
      var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

      // debug
      alert(res);

      var adminList = res;

      // admin does not exist
      if(!adminList.includes(admin.value))
      {
        setMessage("That admin does not exist");
        return;
      }
    }
    catch (e) {
      alert(e.toString());
      return;
    }

    var js = '{"userName":"'
      + userName.value
      + '","Password":"'
      + password.value
      + '","firstName":"'
      + firstName.value
      + '","lastName":"'
      + lastName.value
      + '","email":"'
      + email.value
      + '","admin":"'
      + admin.value + '"}';

    try {
      var token = jwt.sign(js, ePassword);

      var tokenJSON = '{"token":"' + token + '"}';

      const response = await fetch(BASE_URL + 'api/registerUser',
        { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

      // verify returned token
      var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

      if (res.error != "") {
        setMessage(res.error);
      }
      else {
        var user = { firstName: firstName.value, lastName: lastName.value, id: res.id, userName: userName.value, admin: admin.value }
        localStorage.setItem('user_data', JSON.stringify(user));

        document.getElementById('loginResult').innerHTML = "Account made, please check your email for verification";

        document.getElementById("loginDiv").style.display = "block";
        document.getElementById("signupDiv").style.display = "none";
      }
    }
    catch (e) {
      alert(e.toString());
      return;
    }
  }

  // swap to login
  const gotoLogin = event => {
    event.preventDefault();

    document.getElementById("loginDiv").style.display = "block";
    document.getElementById("signupDiv").style.display = "none";
  }


  return (
    <div id="signupDiv">
      <form onSubmit={doSignup}>
        <span id="inner-title">Register Now!</span><br /><br />
        <input type="text" id="signupFirstName" placeholder="First Name" ref={(c) => firstName = c} /><br />
        <input type="text" id="signupLastName" placeholder="Last Name" ref={(c) => lastName = c} /><br />
        <input type="text" id="signupEmail" placeholder="Email" ref={(c) => email = c} /><br />
        <input type="text" id="signupUsername" placeholder="Your Username" ref={(c) => userName = c} /><br />
        <input type="password" id="signupPassword" placeholder="Password" ref={(c) => password = c} /><br />
        <input type="password" id="signupPasswordConfirm" placeholder="Confirm Password" ref={(c) => passwordConfirm = c} /><br />
        <input type="text" id="signupAdminUsername" placeholder="Admin's Username" ref={(c) => admin = c} /><br />
        <button type="button" id="signupButton" class="buttons" onClick={doSignup}> Register </button> <br />
        <button type="button" id="switchToLogin" class="buttons" onClick={gotoLogin}>Back to login</button>
      </form>
      <span id="signupResult">{message}</span>
    </div>

  );
};

export default Signup;
