const https = require('https');

/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const PaytmChecksum = require('paytmchecksum');

var paytmParams = {};

// lGHKbG47926385345015
// Test Merchant Key
// biQ7AHm3IL9CzNN4

paytmParams.body = {
    "mid"             : "lGHKbG47926385345015",
    "linkType"        : "GENERIC",
    "linkDescription" : "Test Payment",
    "linkName"        : "Test"
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "biQ7AHm3IL9CzNN4").then(function(checksum){

    paytmParams.head = {
        "tokenType"   : "AES",
        "signature"   : checksum
    };

    console.log(paytmParams);

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',
        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: '/link/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    post_req.write(post_data);
    post_req.end();
});

