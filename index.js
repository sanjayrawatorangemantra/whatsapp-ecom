var app = require('express')();
var http = require('http');
var mng = require('./mongoose');

const port = 3000
http
.createServer(app).
            listen(port,()=>{
                console.log("listening at port ", port);
            });


