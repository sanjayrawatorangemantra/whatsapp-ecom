var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    name: String,
    email: String,
    mobile: Number,
    password:{type:String,select:false},
    //binary: Buffer,
    status: Boolean,
    created: { type: Date, default: Date.now() },
    role: {type:String,enum:['admin','storeowner']},
    storeno:Number
    //mixed: Schema.Types.Mixed,
    //_someId: Schema.Types.ObjectId,
    //array: [],
    //ofString: [String], // You can also have an array of each of the other types too.
    //nested: { stuff: { type: String, lowercase: true, trim: true } }
}, { versionKey: false });

// Compile model from schema
module.exports = mongoose.model('user', user );
