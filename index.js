var app = require('./app');
var http = require('http');

var product_controller = require('./controllers/product.js');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/product',product_controller)

 

// app.get('/root',function(req,res){
//     res.json({sd:'root'})
// })
// app.use('/addProduct',product_controller.add)
// app.use('/get_product',product_controller)
// app.use('/remove_product',product_controller)

module.exports = app;
var mng = require('./db');


const port = 3000;
http
.createServer(app).
            listen(port,()=>{
                console.log("listening at port ", port);
            });


