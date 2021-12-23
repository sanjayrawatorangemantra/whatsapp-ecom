
var Router = require('express').Router();
var productModel =  require('../models/product');
var cartModel =  require('../models/cart');


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
        var custom_items = items.map((item)=>{
            return {
                name:item.code+' '+item.name,
                price:item.price
            }
        })
        res.json(custom_items)
        // res.send('1 option1 <br> 2 option')
    })
})

Router.get('/getProducts',function(req,res){
    productModel.find({ }, 'name code price weight price', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        // res.json(items)

        var pro =  items.map(function(obj,i){
            return i+' '+obj.name;
        })

        pro = pro.join('<br>')

        res.send(pro);
    })
})

Router.get('/list',function(req,res){
    productModel.find({ }, 'name code', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        res.render('product',{products:items});
    })
})

Router.post('/choose',function(req,res){
    
    var phone = req.body.phone;
    var choice = req.body.choice;

    productModel.find({ }, 'name code price weight price', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        var custom_item = items.filter((item,key)=>{
            console.log(key,choice);
                return (key==choice)
        })
console.log(custom_item);
        // Create an instance of model SomeModel
        if(custom_item.length){
            let model = new cartModel({phone:phone,choice:choice,item:custom_item[0].name});

            // Save the new model instance, passing a callback
            model.save(function (err) {
                if (err) return handleError(err);
                // saved!
                res.json(req.body);
            }); 
        }
    })
})



Router.post('/getCart',function(req,res){
    cartModel.find({phone:req.body.phone}, 'choice phone item', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        
        var custom_items = items.map((item)=>{
            if(item)
            return item.item
        })

        res.json({cart_text:custom_items.join('\n')});

        // res.send('1 option1 <br> 2 option')
    })
})

Router.get('/dummy',function(req,res){
  res.json({dummy:'dummy\ndummy'});
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