import React from 'react';
const sgMail = require("@sendgrid/mail");
require('dotenv').config();

// npm install @sendgrid/mail
// npm install dotenv
// save .env into components

var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var email = ud.email;

sgMail.setApiKey(process.env.API_KEY);
const msg = {
          to: email, //var email,
          from: "bchec521@knights.ucf.edu", //probably gonna want a more professional email.
          subject: "subject", // insert the html that the api produces
    
          template_id: 'd-92f82b1ce16b4bf197bf904b1d5db457', //sendgrid template that I am currently using
          }; 

sgMail.send(msg, function(err,json)
{
    if(err){return console.error(err);}
    console.log(json);
});
