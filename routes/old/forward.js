var request = require("request");
var d = require('domain').create();
d.on('error', function(err){
    // handle the error safely
    console.log('Forward Error:'+err.code);
});


exports = module.exports = function(req, res) {
    if(req.protocol==='http' || req.protocol==='https') {
        d.run(function(){
            // the asynchronous or synchronous code that we want to catch thrown errors on
            try {
                req.pipe(request("http://"+process.env.OLD_SERVER_IP + req.originalUrl)).pipe(res);
            } catch (err) {
                res.end();
                throw err;
            }
        });

    }
}
