const express = require('express');
const mongoose = require('mongoose');
const models = require('./models/url');
const shortid = require('shortid');
const bluebird = require('bluebird');
const validUrl = require('valid-url');
const URL = models.url;

let app = express();

let obj = {};


mongoose.Promise = bluebird;

let url = process.env.MONGOLAB_URI
mongoose.connect(url);
let connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Connection Error : '));
connection.on('open', function(){
	console.log("connected to database");
})


app.get('/shorten/*?', function(req,res){
	obj = {};
	let entry = new URL();
	let sid = shortid.generate();
	let protocol = req.protocol;
	let host = req.get('host');

	let value = req.params[0];

	let isValidUrl = validUrl.isUri(value);

	if(!isValidUrl){
		res.send({error: "Invalid Url"})
	}

	console.log(sid+" "+protocol+" "+host+" "+ value);
	entry.url = value;
	entry.shortened = protocol+"://"+host+"/"+sid;
	entry._id = sid;

	entry.save()
	.then(function(entry){
		obj.original_url = entry.url;
		obj.short_url = entry.shortened;
		res.send(obj);
	})
	.catch(function(err){
		console.log("error",err);
	})

})


app.get('/:short', function(req,res){
	let id = req.params.short;
	URL.findById(id)
	.then(function(entry){
		if(!entry){
			res.end("not found")
		}
		else{
			res.redirect(entry.url);
		}
	})
	.catch(function(err){
		console.log("error",err)
	});
})



app.listen(process.env.PORT || 3000);