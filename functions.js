const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

var url = '';
var client;
var isConnected = false;

function setUrl(Url)
{
	url = Url;
	client = new MongoClient(url, {useUnifiedTopology: true});
}
function getUrl()
{
	return url;
}

function connect()
{
	if(!isConnected)
	{
		try
		{
		  client.connect();
		  isConnected = true;
		}
		catch(e)
		{
		  isConnected = false;
		  console.log('Error: could not connect to database!');
		}
	}
	return isConnected;
}

const find = async (table, json) =>
{
  var db = client.db();
  var results = await db.collection(table).find(json).toArray();
  return results;
};

const search = async (table, field, data) =>
{
  var db = client.db();
  var results = await db.collection(table).find({field:{$regex:data+'.*', $options:'r'}}).toArray();
  return results;
};

const update = function (table, json1, json2) 
{
	var db = client.db();
  	var results = db.collection(table).updateOne(json1, { $set: json2 });
  	return results;
};

const add = async (table, json) =>
{
	try
	{
		var db = client.db();
		var result = db.collection(table).insertOne(json);
		return '';
	}
	catch(e)
	{
		return e.toString();
	}
}

const del = function (table, json) 
{
	var results = '';
	if(connect())
	{
	var db = client.db();
	results = db.collection(table).deleteOne(json);
	}
	return results;
}

module.exports = {
   find: find,
   setUrl: setUrl,
   getUrl: getUrl,
   connect: connect,
   add: add,
   delete: del,
   search: search,
   update, update
}