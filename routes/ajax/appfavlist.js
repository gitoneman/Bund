var keystone = require('keystone');
var UserFav = keystone.list('UserFav');
var repairkey = require('../../lib/utils').repairkey;
var hash = require('../../lib/utils').hash;

exports = module.exports = function(req, res) {
    var code = req.query.c;
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;

    if (code == null || code.length < 24) {
        res.end("1");
        return;
    }

    var id = code.substring(0, 24);
    var pwd = repairkey(code.substring(24));
    console.log(id);
    console.log(pwd);

    keystone.list('User').model.findOne({ _id: id }).exec(function(err, user) {
        console.log("err:"+err);
        console.log(hash(user.password));
        if (user && (pwd == hash(user.password))) {
            //user.getRelated("用户收藏");
            console.log(user);
            return res.json(user);
        }
    });
}
