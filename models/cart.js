var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cart = new Schema({
    choice: Number,
    phone: String,
    item:String,
    //binary: Buffer,
    status: Boolean
});

// Compile model from schema
module.exports = mongoose.model('cart', cart);
