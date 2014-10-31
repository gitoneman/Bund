var weixin = require('../../lib/weixin');

exports = module.exports = function(req, res) {
    console.log("got get wx root");
    weixin.doGet(req,res);
}