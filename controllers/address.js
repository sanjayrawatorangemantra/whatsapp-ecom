
var Router = require('express').Router();
var addressModel =  require('../models/address');

function handleError(err)
{
    console.log(err);
}

Router.post('/add',function(req,res){
    console.log(req.body);
    
    // Create an instance of model SomeModel
    var model = new addressModel(req.body);

    // Save the new model instance, passing a callback
    model.save(function (err) {
        if (err) return handleError(err);
        // saved!
        res.json(req.body);
    }); 

    // res.json({s:'s'});
});


Router.get('/get',function(req,res){
    addressModel.find({ }, 'street landmark city pincode state', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        res.json(items)
    })
})

Router.get('/list',function(req,res){
    addressModel.find({ }, 'street address landmark city pincode state country', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        res.render('address',{address:items});
    })
})

module.exports = Router;

// {
//     add:addProduct,
//     get:getProduct,
//     delete:deleteProduct
// }