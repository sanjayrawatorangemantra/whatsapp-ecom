var express = require('express')
var app = require('express')();
const cors = require("cors");
var multipart = require("connect-multiparty");

var product_controller = require('./controllers/product.js');
var address_controller = require('./controllers/address.js');
var payment  = require('./payment');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    multipart({
      maxFieldsSize: "50MB",
    })
  );
app.use(cors());
app.use('/product',product_controller)
app.use('/address',address_controller)


app.get('/', function(req, res) {
    res.render('index');
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));


// app.get('/root',function(req,res){
//     res.json({sd:'root'})
// })
// app.use('/addProduct',product_controller.add)
// app.use('/get_product',product_controller)
// app.use('/remove_product',product_controller)

module.exports = app;