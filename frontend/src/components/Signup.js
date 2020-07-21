
import React, { useState } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';

function Signup() {

  var firstName;
  var lastName;
  var email;
  var adminId;
  var password;
  var passwordConfirm;

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

    if (adminId.value == null || adminId.value == "") {
      setMessage("Invalid admin ID");
      return;
    }

    var js = '{"userName":"'
      + adminId.value
      + '","Password":"'
      + password.value
      + '","firstName":"'
      + firstName.value
      + '","lastName":"'
      + lastName.value
      + '","email":"'
      + email.value + '"}';

    try {
      var token = jwt.sign(js, ePassword);

      var tokenJSON = '{"token":"' + token + '"}';

      const response = await fetch(BASE_URL + 'api/registerAdmin',
        { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

      // verify returned token
      var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

      if (res.error != "") {
        setMessage(res.error);
      }
      else {
        var user = { firstName: firstName.value, lastName: lastName.value, id: res.id, userName: adminId.value }
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
        <input type="text" id="signupUsername" placeholder="Admin Username" ref={(c) => adminId = c} /><br />
        <input type="password" id="signupPassword" placeholder="Password" ref={(c) => password = c} /><br />
        <input type="password" id="signupPasswordConfirm" placeholder="Confirm Password" ref={(c) => passwordConfirm = c} /><br />
        <button type="button" id="signupButton" class="buttons" onClick={doSignup}> Register </button> <br />
        <button type="button" id="switchToLogin" class="buttons" onClick={gotoLogin}>Back to login</button>
      </form>
      <span id="signupResult">{message}</span>
    </div>

  );
};

export default Signup;
