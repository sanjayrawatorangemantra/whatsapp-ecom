var Router = require('express').Router();
// Requiring the module
var mongoose = require('mongoose');


var userModel =  require('../models/user');

Router.post('/login',async function(req,res){
  
  var email = req.body.email;
  var role = req.body.role;
  var password = req.body.password;
  var doc

  if(role!='admin')
    doc = await userModel.find({email:email,role:role,password:password}).exec();
  else
    doc = await userModel.find({email:email,role:role,password:password}).select('-storeno -__v').exec();
  
  

  if(doc.length){
    res.status(200).json({msg:'user successfully logged in',data:doc}); 
  }
  else
    res.status(400).json({msg:'invalid credentials'}); 

});

Router.get('/list',async function(req,res){
  
  doc = await userModel.find({role:'storeowner'}).select('-storeno -__v').exec();
  
  if(doc.length){
    res.status(200).json({msg:'users list',data:doc}); 
  }
  else
    res.status(400).json({msg:'no users'}); 

});

Router.post('/signup',async function(req,res){  
  
  var email = req.body.email;
  var name = req.body.name;
  var role = req.body.role;
  var mobile = req.body.mobile;
  var password = req.body.password;


  try{
    if(name.trim()=='' || email.trim()=='' || role.trim()=='' || password.trim()==''){
      res.status(400).json({msg:'blank credentials'});
    }
    else{
        doc = await userModel.find({email:email,role:role}).exec();
        console.log(doc);
      if(doc.length){
        res.status(404).json({status:400,msg:"email with the role already exists"});
      }
      else{
        var model = new userModel({name:name,email:email,role:role,password:password});
    
        // Save the new model instance, passing a callback
        model.save().then((user)=>{
          userModel.find({_id:user._id}).exec().then((dt)=>{
            res.status(200).json({msg:'user added',data:dt});
          })
        }).catch((err)=>{
          res.status(400).json({msg:err});
        })
      }

    }
  }
  catch(err){
    res.status(500).json({msg:err})
  }


  // res.json({s:'s'});\\\
});

Router.
post('/storeassign',async function(req,res){

    var id =  req.body.userid;
    // var id = mongoose.Types.ObjectId(req.body.userid);
    var storeno =  req.body.storeno;

    // doc = await userModel.find({
    //   $and: [
    //     { _id:id },
    //     {  _id: { $ne: null } }
    //   ]}).exec();
    // console.log(doc);

    doc = await userModel.find({_id:id,role:'storeowner'}).exec();

    if(!doc.length){
      res.status(400).json({status:400,msg:"user is not a store owner"});
    }
    else{
      
      var query = {_id:id},
      update = { storeno: storeno },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

      // Find the document
      userModel.findOneAndUpdate(query, update, options, function(error, result) {
          if (error) return;
          // do something with the document
          if(result)
              res.status(200).json({data:result,status:200,msg:'successfully assigned'});
          else
              res.status(404).json({data:result,status:400,msg:"error occured"});
      });

    }


})



module.exports = Router;
