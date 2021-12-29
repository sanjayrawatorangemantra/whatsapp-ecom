var Router = require('express').Router();
// Requiring the module
var multer = require('multer');
var uniqueSuffix;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // let userId = req.user._id;
    // let path = `./public/uploads//${userId}`;
    // fs.mkdirsSync(path);
    // callback(null, path);
    console.log(req.body);
    cb(null, './Public')
  },
  filename: function (req, file, cb) {
    uniqueSuffix = Math.round(Math.random() * 1E9)
    cb(null, file.fieldname+'-'+uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })


var storeModel =  require('../models/store');

Router.post('/storemenu',function(req,res){
    console.log(req.body);
    
    // res.json({s:'s'});\\\
});

Router.post('/uploadmenu',upload.single('menu'),function(req,res){
  // console.log(req.body.storeno)  
  console.log(uniqueSuffix)
    var storeno = req.body.storeno;
  // Printing data
 
      var model = new storeModel({
        storeno:storeno,
        menu_img:req.file.originalname+'-'+uniqueSuffix
      });
      // Save the new model instance, passing a callbak
      model.save().then((menu)=>{
        res.status(200).json({msg:'successfully uploaded menu',data:menu})
      }) 


})

module.exports = Router;
