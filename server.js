const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const account = require('./accounts');
const mail = require('./email');
const path = require('path');
const id = require('mongodb').ObjectId;
const password = 'shhhhh';

const base_url = 'https://cop4331-g25.herokuapp.com/';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'frontend', 'build')));


app.get('/cards', (req, res) => 
{
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
});


app.post('/api/jwtTest', async(req, res, next) =>{
	// const {userName, Password} = req.body;
	// account.login(res, 'Users', userName, Password);
	// var token = jwt.sign(req.body, 'shhhhh');
	var decoded = jwt.verify(req.body.token, password);
	res.status(200).json(decoded);

});

app.post('/api/jwtSign', async(req, res, next) =>{
	var decoded = jwt.sign(req.body, password);
	res.status(200).json({token:decoded});
});



// The fallowing functions work and can be uncommented if you want to use them
// however they are unsafe, i use them for testing. If you need the functionality
// form one of them, let me know and ill make a more user friendly version for you
// thanks!
// ------------------------- unsafe low level functions --------------------------- //

// app.post('/api/add', async (req, res, next) => {
// 	const { table, filter } = req.body;
// 	var results = await account.db.add(table, filter);

// 	account.db.sendjson(res, results);
// });

// app.post('/api/delete', async (req, res, next) => {
//   	const { table, filter } = req.body;
// 	var results = account.db.delete(table, filter);
  
//   	account.db.sendjson(res, results);
// });

// app.post('/api/update', async (req, res, next) => {
// 	const { table, filter1, filter2 } = req.body;
// 	var results = account.db.update(table, filter1, filter2);

// 	account.db.sendjson(res, results);
// });


// app.post('/api/searchExact', async (req, res, next) => {
// 	const { table, filter } = req.body;
// 	var results = await account.db.find(table, filter);

// 	account.db.sendjson(res, results);
// });

// ----------------------- end of unsafe low level functions ---------------------- //


// Before each of these functions is an example json input describing what info
// the function expects, it can be coyied and pasted for immediate use
// ------------------------- safe high level functions --------------------------- //
// {
//   "userName": "543212",
//   "Password": "12345"
// }
app.post('/api/loginUser', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {userName, Password} = decoded;
	account.login(res, 'Users', userName, Password);
});

// {
//   "userName": "543212",
//   "Password": "12345"
// }
app.post('/api/loginAdmin', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {userName, Password} = decoded;
	account.login(res, 'Admins', userName, Password);
});


// {
//   "userName": "54321",
//   "Password" : "12345",
//   "firstName" : "Users",
//   "lastName" : "12345",
//   "email": "543212",
//   "admin" : 5
// }
app.post('/api/registerUser', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {userName, Password, firstName, lastName, email, admin} = decoded;
	account.register(res, 'Users', userName, Password, firstName, lastName, email, admin);
});

// {
//   "userName": "54321",
//   "Password" : "12345",
//   "firstName" : "Users",
//   "lastName" : "12345",
//   "email": "543212"
// }
app.post('/api/registerAdmin', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {userName, Password, firstName, lastName, email} = decoded;
	account.register(res, 'Admins', userName, Password, firstName, lastName, email);
});


// {
//   "userName": "543212",
//   "startLocation": "",
//   "destination": "",
//   "purpose": "",
//   "weather": "",
//   "startTime": ""
// }
app.post('/api/makeTrip', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {userName, startLocation, destination, purpose, weather, startTime} = decoded;
	account.makeTrip(res, userName, startLocation, destination, purpose, weather, startTime);
});


// {
//   "tripId": "5efe59a2f1211c174a11d441",
//   "isApproved": true,
//   "comments": "sounds good"
// }
app.post('/api/approveTrip', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {tripId, isApproved, comments} = decoded;
	account.approveTrip(res, tripId, isApproved, comments);
});


// NOTE: please dont use my email for testing, it does work but you wont see if the email
// went through or not, and I will be confused about the extra emails in my inbox
// {
//   "to" : "michaelrogatinsky@gmail.com",
//   "subject": "543212",
//   "text": "test email",
//   "html": ""
// }
app.post('/api/sendMail', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	const {to, subject, text, html} = decoded;
	mail.send(res, to, subject, text, html);
});



// no input required
app.post('/api/listAdmins', async(req, res, next) =>{
	account.listAdmins(res);
});


// this endpoint does not require a normal input,
// instead the url is the input. after the normal url
// you add "?userName=<user>&Password=<pass>" so the url would look something like
// https://www.largeproject.app/api/Verify?userName=Michael12345&Password=securePass
// in that way the user can simply click the link in there email
// to verify there account. 
// it can also be called form an html button embedded in an email
app.get('/api/Verify', async(req, res, next) =>{
	// var userName = require('url').parse(req.url,true).query.userName;
	// var Password = require('url').parse(req.url,true).query.Password;
	var Id = require('url').parse(req.url,true).query.Id;
	account.verify(res, Id);
	
});

// {
// 	"userName":"user1",
// 	"Password":"pass"
// }
app.post('/api/sendResetPassword', async(req, res, next) =>{
	// var userKey = require('url').parse(req.url,true).query.Key;
	var decoded = jwt.verify(req.body.token, password);
	var {userName, Password} = decoded;
	var user = await account.db.find('Users', {userName:userName});
	var admin = await account.db.find('Admins', {userName:userName});
	var id;
	var to;
	if(user.Results.length > 0)
	{
		id = user.Results[0]._id;
		to = user.Results[0].email;
	}
	else
	{
		id = admin.Results[0]._id;
		to = admin.Results[0].email;
	}
	var key = jwt.sign({Password:Password}, password);
	var text = "Password reset link:\n" + base_url + 'api/Reset?Id=' + id + '&Key=' + key;
	mail.send(res, to, "Password Reset", text, "");
	account.db.sendjson(res, {error:""});
});


app.get('/api/Reset', async(req, res, next) =>{
	// var userName = require('url').parse(req.url,true).query.userName;
	// var Password = require('url').parse(req.url,true).query.Password;
	var Id = require('url').parse(req.url,true).query.Id;
	var key = require('url').parse(req.url,true).query.Key;
	var Key = jwt.verify(key, password).Password;
	var login = {_id: id.ObjectId(Id)};
	var change = {Password: Key};
	var user = await account.db.update("Users", login, change);
	var admin = await account.db.update("Admins", login, change);
// 	account.db.sendjson(res, {Results: 'Password Changed!',error:''});
	res.redirect('https://cop4331-g25.herokuapp.com');
});

// {
//   "userName": "myusername"
// }
app.post('/api/listTripsByUser', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	var {userName} = decoded;
	account.listTripsByUser(res, userName);
});

// {
//   "userName": "myusername"
// }
app.post('/api/listTripsByAdmin', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
	var {userName} = decoded;
	account.listTripsByAdmin(res, userName);
});

// the fields in new data do not all need to be included, only the ones you want to change
// {
//   "_id":"5efe59a2f1211c174a11d441",
//   "newData":
//   {
//     "userId":"5efe51c3d435ff137d3977c3",
//     "adminId":"5efe59a2f1211c174a11d441",
//     "startLocation":"",
//     "destination":"",
//     "locations":[],
//     "progress":0,
//     "startTime":"",
//     "endTime":"",
//     "purpose":"",
//     "isApproved":true,
//     "isNew":false,
//     "comments":"sounds good",
//     "weather":"",
//   }
// }
app.post('/api/editTrip', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
  var {_id, newData} = decoded;
	account.editTrip(res, _id, newData);
});

// {
// 	"Id":"5efe51c3d435ff137d3977c3"
// }
app.post('/api/getById', async(req, res, next) =>{
	var decoded = jwt.verify(req.body.token, password);
  var {Id} = decoded;
	account.getById(res, Id);
});

app.post('/api/test', async(req, res, next) =>{
	console.log(6);
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port " + port);
}); // start Node + Express server on port 5000
