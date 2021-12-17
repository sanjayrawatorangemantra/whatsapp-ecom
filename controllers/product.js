var Router = require('express').Router;
var productModel =  require('../models/product');

Router.post('/',function(req,res){
    console.log(req.body);
})

module.exports = {
    add:
};