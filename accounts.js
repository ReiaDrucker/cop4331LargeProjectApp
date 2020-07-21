const db = require('./crud');
const url = 'mongodb+srv://dbapiuser:zgzFa2P2JgZ0O55t@cluster0-dzs17.mongodb.net/COP4331?retryWrites=true&w=majority';
const id = require('mongodb').ObjectId;
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
const mail = require('./email');

const BASE_URL = 'https://cop4331-g25.herokuapp.com/';

// const url = 'mongodb+srv://RickLeinecker:COP4331Rocks@cluster0-4pisv.mongodb.net/COP4331?retryWrites=true&w=majority';

db.setUrl(url);
db.connect();

const login = async(res, table, user, pass) =>
{
	var results = await db.find(table, {userName: user, Password: pass});
	var result;
	if(results.Results.length <= 0)
	{
		result = {error:'username/password incorrect'}
		db.sendjson(res, result);
		return -1;
	}
	result = results.Results[0];
	result.error = results.error;
	delete result._id;
	db.sendjson(res, result);
};

const register = async(res, table, user, pass, first, last, email, admin=0) =>
{
	
	var error = '';
	var json = {
		isVerified: false,
		userName: user,
		Password: pass,
		firstName: first,
		lastName: last,
		email: email
	};
	if(admin != 0)
	{
		json.admin = admin;
	}
	var username = await db.find('Users', {userName: user});
	if(username.Results.length > 0)
	{
		db.sendjson(res, {Results:'', error: 'username in use'});
		return -1;
	}
	username = await db.find('Admins', {userName: user});
	if(username.Results.length > 0)
	{
		db.sendjson(res, {Results:'', error: 'username in use'});
		return -1;
	}
	if(admin != 0)
	{
		var adminId = await db.find('Admins', {userName: admin});
		if(adminId.Results.length <= 0 )
		{
			error = 'admin does not exist';
		}
		else
		{
			json.admin = adminId.Results[0]._id;
		}
	}
	var results = await db.add(table, json);
	if(error != '')
	{
		results.error = error;
	}

	var User = await db.find(table, json);
	
// 	var text = BASE_URL + 'api/Verify?userName='+user+'&Password='+pass;
	var text = BASE_URL + 'api/Verify?Id=' + User.Results[0]._id;

	mail.send(res, email, 'Hello', 'this is a verification email. go to this link: ' + text);
	
	
	db.sendjson(res, results);
	
};

const makeTrip = async(res, userName, startLocation, destination, purpose, weather=0, startTime=0) =>
{
	var json = {
		userId: -1,
		adminId: -1,
		startLocation: startLocation,
		destination: destination,
		locations: [startLocation],
		progress: 0,
		startTime: startTime,
		endTime: '',
		purpose: purpose,
		isApproved: false,
		isNew: true,
		comments: '',
		weather: weather
	}
	var username = await db.find('Users', {userName: userName});
	if(username.Results.length <= 0)
	{
		db.sendjson(res, {Results:'', error: 'username not valid'});
		return -1;
	}
	username = username.Results[0];
	json.userId = id.ObjectId(username._id);
	json.adminId = id.ObjectId(username.admin);

	var results = await db.add('Trips', json);

	db.sendjson(res, results);
};

const approveTrip = async(res, tripId, isApproved, comments) =>
{
	var og = await db.find('Trips', {_id: id.ObjectId(tripId)});
	// console.log(og);
	if(og.Results.length <= 0)
	{
		db.sendjson(res, {Results:'', error: 'could not find trip/trip does not exist'});
		return -1;
	}
	og = og.Results[0];
	var mod = {
		isNew: false,
		isApproved: isApproved,
		comments: comments
	};

	var results = db.update('Trips', og, mod);

	db.sendjson(res, results);
};

const getUserId = async(userName) =>
{
	var user = await db.find('Users', {userName: userName});
	var results;
	if(user.Results.length <= 0)
	{
		results = {Results: false, error: 'user does not exits'};
	}
	else
	{
		results = {Results: user.Results[0]._id, error: ''};
	}

	return results;
};

const getAdminId = async(userName) =>
{
	var user = await db.find('Admins', {userName: userName});
	var results;
	if(user.Results.length <= 0)
	{
		results = {Results: false, error: 'user does not exits'};
	}
	else
	{
		results = {Results: user.Results[0]._id, error: ''};
	}

	return results;
};

const listTripsByUser = async(res, userName) =>
{
	var userId = await getUserId(userName);
	var results;
	if(userId.Results == false)
	{
		results = {error: 'user does not exist'};
	}
	else
	{
		results = await db.find('Trips', {userId: id.ObjectId(userId.Results)});
	}

	db.sendjson(res, results);
};

const listTripsByAdmin = async(res, userName) =>
{
	var userId = await getAdminId(userName);
	var results;
	if(userId.Results == false)
	{
		results = {error: 'admin does not exist'};
	}
	else
	{
		results = await db.find('Trips', {adminId: id.ObjectId(userId.Results)});
	}

	db.sendjson(res, results);
};

const listAdmins = async(res) =>
{
	var admins = await db.find('Admins', {});
	if(admins.Results.length <= 0)
	{
		db.sendjson(res, {Results:'', error: 'no admins found in database'});
		return -1;
	}
	for(i = 0; i < admins.Results.length; i++)
	{
		delete admins.Results[i]._id;
		delete admins.Results[i].isVerified;
		delete admins.Results[i].Password;
		delete admins.Results[i].admin;
		delete admins.Results[i].email;
	}
	db.sendjson(res, admins);
};

const verify = async(res, Id) =>
{
	var login = {_id: id.ObjectId(Id)};
	var change = {isVerified: true};
	var result = await db.update('Users', login, change);
	var result = await db.update('Admins', login, change);
// 	db.sendjson(res, {Results: 'Account Verified!',error:''});
	res.redirect('https://cop4331-g25.herokuapp.com');
};

const editTrip = async(res, _id, newData)=>
{
	if(newData.hasOwnProperty('userId'))
	{
		newData.userId = id.ObjectId(newData.userId);
	}
	if(newData.hasOwnProperty('adminId'))
	{
		newData.adminId = id.ObjectId(newData.adminId);
	}
  var results = await db.update('Trips', {_id:id.ObjectId(_id)}, newData);
  db.sendjson(res, results);
};

const getById = async(res, Id) =>
{
	var json = 
	{
		_id:id.ObjectId(Id)
	};
	var user = await db.find('Users', json);
	var admin = await db.find('Admins', json);
	var results;
	if(user.error == '')
	{
		results = user.Results[0];
		results.error = '';
		delete results._id;
		delete results.Password;
	}
	else if(admin.error == '')
	{
		results = admin.Results[0];
		results.error = '';
		delete results._id;
		delete results.Password;
	}
	else
	{
		results = 
		{
			error: 'no user/admin with that id'
		};
	}
	db.sendjson(res, results);
};

module.exports = {
	db: db,
	login: login,
	register: register,
	makeTrip: makeTrip,
	approveTrip: approveTrip,
	listAdmins: listAdmins,
	verify: verify,
	listTripsByAdmin: listTripsByAdmin,
	listTripsByUser: listTripsByUser,
	editTrip: editTrip,
	getById: getById
}
