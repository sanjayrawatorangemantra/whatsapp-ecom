var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var address = new Schema({
    storeno:{ type: Number, min: 1, max: 10000, required: true },
    menu_img:String
    //mixed: Schema.Types.Mixed,
    //_someId: Schema.Types.ObjectId,
    //array: [],
    //ofString: [String], // You can also have an array of each of the other types too.
    //nested: { stuff: { type: String, lowercase: true, trim: true } }
});

// Compile model from schema
module.exports = mongoose.model('store', address);
