        var Router = require('express').Router();
        // Requiring the module
        const reader = require('xlsx')
        const path = require("path");

        var productModel =  require('../models/product');
        var storeModel =  require('../models/store');
        var cartModel =  require('../models/cart');
        var userModel =  require('../models/user');
        
        var fs = require('fs');

        // var multiparty = require("connect-multiparty");
        // var multipartyMiddleware = multiparty({ uploadDir:__dirname+'../Public/'});

        var multer = require('multer');
        const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // let userId = req.user._id;
            // let path = `./public/uploads//${userId}`;
            // fs.mkdirsSync(path);
            // callback(null, path);
            console.log(req.body);
            cb(null, './Public/xls')
        },
        filename: function (req, file, cb) {
            // uniqueSuffix = Math.round(Math.random() * 1E9)
            cb(null,file.originalname)
        }
        })
        
        const upload = multer({ storage: storage })


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
            
            var userid = req.query.userid;

            if(userid){
                userModel.find({_id:userid }).exec().then(function (store) {
                    console.log(store);


                    if(store.length && store[0].role!='admin'){
                        var storeno = store[0].storeno;
        
                        console.log(storeno);

                        productModel.find({storeno:storeno}).exec().then((list)=>{
            
                            var custom_items = list.map((item)=>{
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
                    }
                    else{
                        res.status(404).json({data:[],status:404,msg:'No Record found for this user'})
                    }

                })

            }
            else{
                productModel.find({}).exec().then((list)=>{
            
                    var custom_items = list.map((item)=>{
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
            })
            }
        })

        Router.post('/search',async function(req,res){
            
            var search = req.body.search;


            productModel.find({name:{ $regex: search , $options : 'i'}})
            .limit(10)
            .exec(function(err, items) { 
                    if(items.length){
                        res.status(200).json({data:items,status:200,msg:'Record found'})
                    }
                    else{
                        res.status(404).json({data:items,status:404,msg:'No Record found'})
                    }
                    console.log(err);
            });

            // productModel.find({name:{ $regex: search }}, 'name code price weight price', function (err, items) {
            //     if (err) return handleError(err);
            //     // 'athletes' contains the list of athletes that match the criteria.
            //     console.log(items);

            // })
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

        Router.get('/getStoreProducts',function(req,res){
            var storeno = req.query.storeno;
            console.log(storeno);
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



        Router.post('/upload',upload.single('file'),function(req,res){

            var dir = path.resolve("./Public/xls");

            // __dirname+'../Public/xls'+req.file.originalname;
            console.log(dir)

            // console.log(req.files.file.path)
            
            var storeno = req.body.storeno;
            const file = reader.readFile(`${dir}/${req.file.originalname}`)

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
                console.log('-->');
                console.log(storeno);


                if(storeno)
                    data[i]['storeno'] = storeno;
                
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