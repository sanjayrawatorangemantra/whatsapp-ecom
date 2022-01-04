var Router = require('express').Router();
// Requiring the module
const reader = require('xlsx')
const path = require("path");

var multer = require('multer');

var uniqueSuffix;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // let userId = req.user._id;
    // let path = `./public/uploads//${userId}`;
    // fs.mkdirsSync(path);
    // callback(null, path);
    console.log('---->');
    console.log(file);
    if(file.fieldname=='file'){
      cb(null, './Public/xls')
    }
    else if(file.fieldname=='menu'){
      cb(null, './Public')      
    }

  },
  filename: function (req, file, cb) {
    if(file.fieldname=='file'){
      cb(null,file.originalname)
    }
    else if(file.fieldname=='menu'){
      uniqueSuffix = Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+'-'+file.originalname)
    }

  }
})
const upload = multer({ storage: storage })

var productModel =  require('../models/product');
var addressModel =  require('../models/address');
var storeModel =  require('../models/store');

Router.post('/storemenu',function(req,res){
    console.log(req.body);
    
    // res.json({s:'s'});\\\
});

Router.post('/uploadmenu',upload.fields([{
          name: 'menu', maxCount: 3
        }, {
          name: 'file', maxCount: 10
        }]),function(req,res){
          console.log(req.files);

          if(req.files['menu'] && req.files['file']){
            console.log('here');

            addressModel.updateMany({}, {$unset: {"menu_img": 1}}).then(res => {
              console.log(res.n); // Number of documents matched
              console.log(res.nModified); // // Number of documents modified
            }).catch(err => console.log(err));
            
            try{
              var output = [];
              for(let i=0;i<req.files['menu'].length;i++){
                
                var query = {storeno:storeno},
                update = { 
                  $push: { menu_img:'https://demo55.mageindia.co.in/'+uniqueSuffix+'-'+req.files['menu'][i].originalname  } 
                  },
                
                options = { upsert: true, new: true, setDefaultsOnInsert: true };
        

                // Find the document
                addressModel.findOneAndUpdate(query, update, options, function(error, result) {
                    if (error){
                      console.log(error);
                      // res.status(404).json({data:error,status:400,msg:"error occured"});
                    }
                    // do something with the document

                    if(i==req.files['menu'].length-1){
                      res.status(200).json({msg:'successfully uploaded',data:result});
                    }
                    // if(result){
                    //   console.log(result);
                    //   output.push(result);
                    // }
                });

              }

                
            }catch(err){
              console.log('-->catch');
                res.status(404).json({data:err,status:400,msg:"error occured"});
            }
            
            /*
            var query = {storeno:storeno},
            update = { 
                      $push:{ menu_img:'https://demo55.mageindia.co.in/'+uniqueSuffix+'-'+req.files['menu'][0].originalname }
                     },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };
    console.log(update);
            // Find the document
            addressModel.findOneAndUpdate(query, update, options, function(error, result) {
                if (error){
                  console.log(error);
                  res.status(404).json({data:error,status:400,msg:"error occured"});
                }
                // do something with the document
                if(result)
                     res.status(200).json({msg:'successfully uploaded',data:result});
                else
                    res.status(404).json({data:error,status:400,msg:"error occured"});
            });
            */

            // var model = new storeModel({
            //   storeno:storeno,
            //   menu_img:uniqueSuffix+'-'+req.files['menu'][0].originalname
            // });

            // // Save the new model instance, passing a callbak
            // model.save().then((menu)=>{
            //   res.status(200).json({msg:'successfully uploaded menu',data:menu})
            // }) 

            var dir = path.resolve("./Public/xls");

            // __dirname+'../Public/xls'+req.file.originalname;
            // console.log(dir)
    
            // console.log(req.files.file.path)
            
            var storeno = req.body.storeno;
            const file = reader.readFile(`${dir}/${req.files['file'][0].originalname}`)
    
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
    
    
                if(storeno)
                    data[i]['storeno'] = parseInt(storeno);
                
                console.log('-->');
                console.log(data[i]);

                var model = new productModel(data[i]);
    
                // Save the new model instance, passing a callback
                model.save().then((product)=>{
                    console.log(product);
                }).catch((err)=>{
                  console.log(err);
                })
            }
            // res.status(200).json({msg:'successfully uploaded xls and menu image',data:{menu_img:'https://demo55.mageindia.co.in/'+uniqueSuffix+'-'+req.files['menu'][0].originalname}})

          }
          else if(req.files['menu']){
                // console.log(req.body.storeno)  
              console.log(req.files['menu'])
              var storeno = req.body.storeno;
              // Printing data
            
              addressModel.updateMany({}, {$unset: {"menu_img": 1}}).then(res => {
                console.log(res.n); // Number of documents matched
                console.log(res.nModified); // // Number of documents modified
              }).catch(err => console.log(err));

              try{
                var output = [];
                for(let i=0;i<req.files['menu'].length;i++){
                  
                  var query = {storeno:storeno},
                  update = { 
                    $push: { menu_img:'https://demo55.mageindia.co.in/'+uniqueSuffix+'-'+req.files['menu'][i].originalname  } 
                    },
                  
                  options = { upsert: true, new: true, setDefaultsOnInsert: true };
          

                  // Find the document
                  addressModel.findOneAndUpdate(query, update, options, function(error, result) {
                      if (error){
                        console.log(error);
                        // res.status(404).json({data:error,status:400,msg:"error occured"});
                      }
                      // do something with the document

                      if(i==req.files['menu'].length-1){
                        res.status(200).json({msg:'successfully uploaded',data:result});
                      }
                      // if(result){
                      //   console.log(result);
                      //   output.push(result);
                      // }
                  });

                }

                  
              }catch(err){
                console.log('-->catch');
                  res.status(404).json({data:err,status:400,msg:"error occured"});
              }
              



              // var model = new storeModel({
              //   storeno:storeno,
              //   menu_img:req.files['menu'][0].originalname+'-'+uniqueSuffix
              // });


              // // Save the new model instance, passing a callbak
              // model.save().then((menu)=>{
              //   res.status(200).json({msg:'successfully uploaded',data:menu})
              // }) 
          }
          else if(req.files['file']){
            
            var dir = path.resolve("./Public/xls");

            // __dirname+'../Public/xls'+req.file.originalname;
            console.log(dir)
    
            // console.log(req.files.file.path)
            
            var storeno = req.body.storeno;
            const file = reader.readFile(`${dir}/${req.files['file'][0].originalname}`)
    
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

          }

})

module.exports = Router;
