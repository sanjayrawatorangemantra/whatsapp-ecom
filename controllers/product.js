
var Router = require('express').Router();
var productModel =  require('../models/product');

Router.post('/add',function(req,res){
    console.log(req.body);
    
    // Create an instance of model SomeModel
    var model = new productModel(req.body);

    // Save the new model instance, passing a callback
    model.save(function (err) {
        if (err) return handleError(err);
        // saved!
        res.json(req.body);
    });

    // res.json({s:'s'});
});

Router.get('/get',function(req,res){
    productModel.find({ }, 'name price weight price', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        res.json(items)
    })
})

Router.get('/list',function(req,res){
    productModel.find({ }, 'name ', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        res.render('product',{products:items});
    })
})

module.exports = Router;

// {
//     add:addProduct,
//     get:getProduct,
//     delete:deleteProduct
// }