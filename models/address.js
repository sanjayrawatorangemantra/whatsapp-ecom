var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var address = new Schema({
    street: String,
    address: String,
    //binary: Buffer,
    status: Boolean,
    pincode: { type: String, required: true },
    city: String,
    state: String,
    country: String,
    //mixed: Schema.Types.Mixed,
    //_someId: Schema.Types.ObjectId,
    //array: [],
    //ofString: [String], // You can also have an array of each of the other types too.
    //nested: { stuff: { type: String, lowercase: true, trim: true } }
});

// Compile model from schema
module.exports = mongoose.model('address', address);
