const mongoose = require('mongoose');


const Schema = mongoose.Schema;


//url schema
let urlSchema = new Schema({
	url : {type:String},
	shortened : {type:String},
	_id : {type: String}
})

let u = mongoose.model('url', urlSchema);

module.exports = {url:u};