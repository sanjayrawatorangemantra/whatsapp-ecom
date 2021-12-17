var app = require('express')();
var product_controller = require('./controllers/product.js');
app.use('/whatsapp');
app.use('/addProduct',product_controller.add)
app.use('/get_product',product_controller)
app.use('/remove_product',product_controller)

exports = app;