var request = require("request")

exports = module.exports = function(req, res) {
    if(req.protocol==='http' || req.protocol==='https') {
        //    req.pipe(request("http://112.124.97.208"+req.originalUrl)).pipe(res);
        req.pipe(request("http://10.161.157.71" + req.originalUrl)).pipe(res);
    }
}
