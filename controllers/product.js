
var Router = require('express').Router();
// Requiring the module
const reader = require('xlsx')

var productModel =  require('../models/product');
var cartModel =  require('../models/cart');
var fs = require('fs');

var multiparty = require("connect-multiparty");
var multipartyMiddleware = multiparty({ uploadDir:__dirname+'../Public/'});

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

    // res.json({s:'s'});\\\
});


Router.get('/get',function(req,res){
    productModel.find({ }, '_id name code price weight price', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        var custom_items = items.map((item)=>{
            return {
                id:item._id,
                name:item.code+' '+item.name,
                price:item.price
            }
        })
        res.status(200).json({data:custom_items})
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



Router.
post('/getCart',function(req,res){
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

Router.
post('/storeassign',function(req,res){

    var id =  req.body.id;
    var storeno =  req.body.storeno;

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

Router.post('/upload',multipartyMiddleware,function(req,res){
    console.log(__dirname)
    console.log(req.files.file.path)

    const file = reader.readFile(req.files.file.path)

    let data = []

    const sheets = file.SheetNames

    for(let i = 0; i < sheets.length; i++)
    {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])

        temp.forEach((res) => {
            data.push(res)
        })
    }

    // Printing data
    console.log(data)
    for(let i = 0; i < data.length; i++)
    { console.log(data[i]);
        var model = new productModel(data[i]);

        // Save the new model instance, passing a callback
        model.save().then((product)=>{
            console.log(product);
        }) 
    }

    res.status(200).json({msg:'successfully uploaded xls',data:[]})

    // fs.rename(req.files.xls.path, __dirname + '/Public/' + req.files.xls.originalFilenameame,function(err) {
    //     if ( err ) console.log('ERROR: ' + err);
    // });); 

    // cartModel.find({phone:req.body.phone}, 'choice phone item', function (err, items) {
    //     if (err) return handleError(err);
    //     // 'athletes' contains the list of athletes that match the criteria.
        
    //     var custom_items = items.map((item)=>{
    //         if(item)
    //         return item.item
    //     })

    //     res.json({cart_text:custom_items.join('\n')});

    //     // res.send('1 option1 <br> 2 option')
    // })
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

Router.get('/delallcart',function(req,res){
    res.json(cartModel.remove().exec());
})

module.exports = Router;

// {
//     add:addProduct,
//     get:getProduct,
//     delete:deleteProduct
// }