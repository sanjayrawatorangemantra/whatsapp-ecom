var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    name: String,
    code: String,
    //binary: Buffer,
    status: Boolean,
    updated: { type: Date, default: Date.now() },
    price: { type: Number, min: 0, max: 10000, required: true },
    weight: String,
    //mixed: Schema.Types.Mixed,
    //_someId: Schema.Types.ObjectId,
    //array: [],
    //ofString: [String], // You can also have an array of each of the other types too.
    //nested: { stuff: { type: String, lowercase: true, trim: true } }
});

// Compile model from schema
module.exports = mongoose.model('product', product );
