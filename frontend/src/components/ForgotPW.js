import React, { useState } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';

function ForgotPW() {

  var username;
  var password;
  var passwordConf;

  //  password for token encryption
  var ePassword = "shhhhh";

  const [message, setMessage] = useState('');



  const doForgotPW = async event => {
    event.preventDefault();

    // check confirm password
    if (password.value != passwordConf.value) {
      setMessage("Passwords do not match")
      return;
    }

    // check for invalid password
    if (password.value == null || password.value == "") {
      setMessage("Invalid password");
      return;
    }

    var js = '{"userName":"'
      + username.value
      + '","Password":"'
      + password.value + '"}';

    try {
      var token = jwt.sign(js, ePassword);

      var tokenJSON = '{"token":"' + token + '"}';

      const response = await fetch(BASE_URL + 'api/sendResetPassword',
        { method: 'POST', body: tokenJSON, headers: { 'Content-Type': 'application/json' } });

      // verify returned token
      var res = jwt.verify(JSON.parse(await response.text()).token, ePassword);

      if (res.error != "") {
        setMessage(res.error);
      }
      else {

        document.getElementById("loginDiv").style.display = "block";
        document.getElementById("signupDiv").style.display = "none";
        document.getElementById("ForgotDiv").style.display = "none";

        document.getElementById('loginResult').innerHTML = "Email sent to verify new password, your password will not reset until you confirm via email.";
      }
    }
    catch (e) {
      alert(e.toString());
      return;
    }
  }

  // swap to login page
  const gotoLogin = event => {
    event.preventDefault();

    document.getElementById("loginDiv").style.display = "block";
    document.getElementById("signupDiv").style.display = "none";
    document.getElementById("ForgotDiv").style.display = "none";
  }


  return (
    <div id="ForgotDiv">
      <form onSubmit={doForgotPW}>
        <span id="inner-title">Provide Your username and desired new password. You'll confirm your password change via your email.</span><br /><br />
        <input type="text" id="forgotUsername" placeholder="Username" ref={(c) => username = c} /><br />
        <input type="password" id="forgotPW" placeholder="New Password" ref={(c) => password = c} /><br />
        <input type="password" id="forgotPWConfirm" placeholder="Confirm New Password" ref={(c) => passwordConf = c} /><br />
        <button type="button" id="forgotRecover" class="buttons" onClick={doForgotPW}> Recover Password </button> <br />
        <button type="button" id="forgotToLogin" class="buttons" onClick={gotoLogin}>Return to Login</button> <br />

      </form>
      <span id="ForgotResult">{message}</span>
    </div>
  );
};

export default ForgotPW;