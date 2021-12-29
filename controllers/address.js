
    var Router = require('express').Router();
    var addressModel =  require('../models/address');

    function handleError(err)
    {
        console.log(err);
    }

    function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
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

    Router.post('/storeassign',function(req,res){

    var id =  req.body.id;
    var storeno =  req.body.storeno;

    var query = {_id:id},
    update = { storeno: storeno },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    addressModel.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        // do something with the document
        if(result)
            res.status(200).json({data:result,status:200,msg:'successfully assigned'});
        else
            res.status(404).json({data:result,status:400,msg:"error occured"});
    });

})

    Router.get('/get',function(req,res){
        addressModel.find({ }, 'street landmark city pincode state lat long', function (err, items) {
            if (err) return handleError(err);
            // 'athletes' contains the list of athletes that match the criteria.
            res.json(items)
        })
    })

    Router.get('/delbyid/:id',function(req,res){
        console.log(req.params.id);
        var doc = addressModel.find({ _id:req.params.id }).deleteOne().exec();
        res.json(doc);
    })

    Router.get('/delall',function(req,res){
        res.json(addressModel.remove().exec());
    })

    Router.get('/storelist',function(req,res){
        addressModel.find({ }, 'storeno street address landmark city pincode state country lat long menu_img', function (err, items) {
            if (err) return handleError(err);
            // 'athletes' contains the list of athletes that match the criteria.
            res.status(200).json({data:items,status:200,msg:'successfully fetched stores'});
        })
    })

    Router.get('/list',function(req,res){
        addressModel.find({ }, 'street address landmark city pincode state country lat long menu_img', function (err, items) {
            if (err) return handleError(err);
            // 'athletes' contains the list of athletes that match the criteria.
            res.render('address',{address:items});
        })
    })

    Router.post('/nearbylocation',function(req,res){
        addressModel.find({ }, 'street address landmark city pincode state country lat long', function (err, items) {
                
            console.log(req);
            console.log(req.params);
            var q = req.body.address;
            //'https://maps.google.com/maps?q=30.2845536,78.097141'
            var latlong = q.split('=')[q.split('=').length-1].split(',');
            
            // latlong = [ '30.2844554', '78.0974535' ];
            // latlong = [ '30.4543', '78.1114' ];
           
            var poslat = parseFloat(latlong[0]); //[ '30.2845312', '78.0973485' ]
            //
            var poslng = parseFloat(latlong[1]);
            //
            console.log(typeof(poslat));
            console.log(poslat,poslng);
console.log(items);


            var shortest = distance(poslat, poslng, items[0].lat, items[0].long, "K");
            var html=items[0].address;

            for (var i = 0; i < items.length; i++) {
                console.log(distance(poslat, poslng, items[i].lat, items[i].long, "K"));
                // if this location is within 0.1KM of the user, add it to the list
                if (distance(poslat, poslng, items[i].lat, items[i].long, "K") <= shortest) {
                    shortest = distance(poslat, poslng, items[i].lat, items[i].long, "K");
                    html = items[i].address;
                }
                
            }
            console.log(html);
            res.json({location:html});
            // if (err) return handleError(err);
            // // 'athletes' contains the list of athletes that match the criteria.
            // res.render('address',{address:items});
        })
    })

    module.exports = Router;

    // {
    //     add:addProduct,
    //     get:getProduct,
    //     delete:deleteProduct
    // }