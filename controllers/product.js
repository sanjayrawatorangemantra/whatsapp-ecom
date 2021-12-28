
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
                namewithcode:item.code+' '+item.name,
                code:item.code,
                name:item.name,
                price:item.price,
                weight:item.weight,
                status:item.status,
                storeno:item.storeno
            }
        })
        if(custom_items.length){
            res.status(200).json({data:custom_items,status:200,msg:'Record found'})
        }
        else{
            res.status(404).json({data:custom_items,status:404,msg:'No Record found'})
        }

        // res.send('1 option1 <br> 2 option')
    })
})

Router.get('/getProducts',function(req,res){
    productModel.find({ }, 'name code price weight price status', function (err, items) {
        if (err) return handleError(err);
        // res.json(items)

        var pro =  items.map(function(obj,i){
            return i+' '+obj.name;
        })

        pro = pro.join('<br>')

        res.send(pro);
    })
})

Router.post('/getStoreProducts',function(req,res){
    var storeno = req.body.storeno;

    productModel.find({storeno:storeno}, 'name code price weight price storeno', function (err, items) {
        if (err) return handleError(err);
        // 'athletes' contains the list of athletes that match the criteria.
        // res.json(items)

        // var pro =  items.map(function(obj,i){
        //     return i+' '+obj.name;
        // })

        // pro = pro.join('<br>')

        // res.send(pro);
        if(items.length)
        res.status(200).json({data:items,msg:'Fetched products'});
        else
        res.status(404).json({data:[],msg:'Not found'});
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

        res.status(200).json({cart_text:custom_items.join('\n')});

        // res.send('1 option1 <br> 2 option')
    })
})

Router.
post('/storeassign',function(req,res){

    var id =  req.body.id;
    var storeno =  req.body.storeno;

    var query = {_id:id},
    update = { storeno: storeno },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    productModel.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        // do something with the document
        if(result)
            res.status(200).json({data:result,status:200,msg:'successfully assigned'});
        else
            res.status(404).json({data:result,status:400,msg:"error occured"});
    });

})

Router.get('/storelist',function(req,res){

    productModel.find().distinct('storeno', function(error, ids) {
        if(!error)
            res.status(200).json({data:ids,status:200,msg:'fetched stores'});
        else
            res.status(404).json({data:[],status:400,msg:"error occured"});
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
Router.post('/delbyid',function(req,res){
    console.log(req.body.id);
    var doc = productModel.find({ _id:req.body.id }).deleteOne().exec();
    if(doc){
        console.log(doc);
        res.status(200).json({data:doc,status:200,msg:'successfully deleted'});
    }
    else{
        console.log(doc);
        res.status(400).json({data:[],status:200,msg:'error occured'});

    }

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