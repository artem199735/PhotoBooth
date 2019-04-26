var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PhotoSchema = new Schema({
	event:String,
	instagramHandle:String,
	method:String,
	status:String,
	device:String,
	buffer: Buffer,
    filename: String,
    contentType: String,
    createdAt    : { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('phototable', PhotoSchema)
