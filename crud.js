const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');

const password = 'shhhhh';

var url = '';
var client;
var isConnected = false;

function sendjson(res, json) {
	var encode = jwt.sign(json, password);
	res.status(200).json({token: encode});
}

function setUrl(Url) {
	url = Url;
	client = new MongoClient(url, { useUnifiedTopology: true });
}
function getUrl() {
	return url;
}

function connect() {
	if (!isConnected) {
		try {
			client.connect();
			// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
			isConnected = true;
		}
		catch (e) {
			isConnected = false;
			console.log('Error: could not connect to database!');
		}
	}
	return isConnected;
}

const find = async (table, json) => {
	var results;
	var error = '';
	if (connect()) {
		var db = client.db();
		results = await db.collection(table).find(json).toArray();
		if (results.length <= 0) {
			error = 'could not find data';
		}
	}
	else {
		error = 'could not connect to database';
	}

	return { Results: results, error: error };
};

// const search = async (table, field, data) => {
// 	var db = client.db();
// 	var results = await db.collection(table).find({ field: { $regex: data + '.*', $options: 'r' } }).toArray();
// 	return results;
// };

const update = function(table, json1, json2) {
	var results;
	var error = '';
	if(connect()){
		var db = client.db();
		results = db.collection(table).updateOne(json1, { $set: json2 });
	}
	else{
		error = 'could not connect to database';
	}
	
	return { Results: results, error: error };
};

const add = async (table, json) => {
	var results;
	var error = '';
	if(connect()){
		try {
			var db = client.db();
			results = db.collection(table).insertOne(json);
		}
		catch (e) {
			error = e.toString();
		}
	}
	else{
		error = 'could not connect to database';
	}
	return { Results: results, error: error };
}

const del = function(table, json) {
	var results;
	var error = '';
	if (connect()) {
		var db = client.db();
		results = db.collection(table).deleteOne(json);
	}
	else{
		error = 'could not connect to database';
	}
	return { Results: results, error: error };
}

module.exports = {
	find: find,
	setUrl: setUrl,
	getUrl: getUrl,
	connect: connect,
	add: add,
	delete: del,
	update: update,
	sendjson: sendjson
}