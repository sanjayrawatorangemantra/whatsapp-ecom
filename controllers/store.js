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
var storeModel =  require('../models/store');

Router.post('/storemenu',function(req,res){
    console.log(req.body);
    
    // res.json({s:'s'});\\\
});

Router.post('/uploadmenu',upload.fields([{
          name: 'menu', maxCount: 1
        }, {
          name: 'file', maxCount: 1
        }]),function(req,res){
          // console.log(req.files);

          if(req.files['menu'] && req.files['file']){
            console.log('here');
            var model = new storeModel({
              storeno:storeno,
              menu_img:uniqueSuffix+'-'+req.files['menu'][0].originalname
            });

            // Save the new model instance, passing a callbak
            model.save().then((menu)=>{
              res.status(200).json({msg:'successfully uploaded menu',data:menu})
            }) 

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

            res.status(200).json({msg:'successfully uploaded xls and menu image',data:{menu_img:'https://demo55.mageindia.co.in/'+uniqueSuffix+'-'+req.files['menu'][0].originalname}})

          }
          else if(req.files['menu']){
                // console.log(req.body.storeno)  
              console.log(uniqueSuffix)
              var storeno = req.body.storeno;
              // Printing data
          
              var model = new storeModel({
                storeno:storeno,
                menu_img:req.files['menu'][0].originalname+'-'+uniqueSuffix
              });
              // Save the new model instance, passing a callbak
              model.save().then((menu)=>{
                res.status(200).json({msg:'successfully uploaded',data:menu})
              }) 
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
