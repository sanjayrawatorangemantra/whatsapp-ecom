
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
    productModel.find({ }, 'name code price weight price', function (err, items) {
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

Router.get('/delbyid/:id',function(req,res){
    console.log(req.params.id);
    var doc = productModel.find({ _id:req.params.id }).deleteOne().exec();
    res.json(doc);
})

Router.get('/delall',function(req,res){
    res.json(productModel.remove().exec());
})

module.exports = Router;

// {
//     add:addProduct,
//     get:getProduct,
//     delete:deleteProduct
// }