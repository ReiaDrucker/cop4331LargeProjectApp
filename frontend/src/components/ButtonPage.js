
import React, { useState } from 'react';
var jwt = require('jsonwebtoken');

const BASE_URL = 'https://cop4331-g25-app.herokuapp.com/';

function ButtonPage() {

    // swap to login
    const gotoLogin = event => {
        event.preventDefault();

        document.getElementById("loginDiv").style.display = "block";
        document.getElementById("buttonsDiv").style.display = "none";
    }

    // swap to signup
    const gotoSignup = event => {
        event.preventDefault();

        document.getElementById("signupDiv").style.display = "block";
        document.getElementById("buttonsDiv").style.display = "none";
    }

    // swap to forgot PW
    const gotoForgotPW = event => {
        event.preventDefault();

        document.getElementById("ForgotDiv").style.display = "block";
        document.getElementById("buttonsDiv").style.display = "none";
    }


    return (
        <div id="buttonsDiv">
            <button type="button" id="sGoToLogin" class="buttons" onClick={gotoLogin}> Login </button><br />
            <button type="button" id="sGoToSignup" class="buttons" onClick={gotoSignup}> Signup </button><br />
            <button type="button" id="sGoToForgotPW" class="buttons" onClick={gotoForgotPW}> Forgot Password </button>
        </div>

    );
};

export default ButtonPage;
