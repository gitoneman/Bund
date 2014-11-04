var request = require("request");
var d = require('domain').create();
d.on('error', function(err){
    // handle the error safely
    console.log('Forward Error:'+err.code);
});


exports = module.exports = function(req, res) {
    if(req.protocol==='http' || req.protocol==='https') {
        //    req.pipe(request("http://112.124.97.208"+req.originalUrl)).pipe(res);
        d.run(function(){
            // the asynchronous or synchronous code that we want to catch thrown errors on
            try {
                req.pipe(request("http://10.161.157.71" + req.originalUrl)).pipe(res);
            } catch (err) {
                throw err;
            }
        });

    }
}
