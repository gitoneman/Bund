var keystone = require('keystone');
var UserFav = keystone.list('UserFav');
var repairkey = require('../../lib/utils').repairkey;
var hash = require('../../lib/utils').hash;

exports = module.exports = function(req, res) {
    var code = req.query.c;
    //var page = (req.query.p)?req.query.p:1;
    //var number = (req.query.n)?req.query.n:12;

    if (code == null || code.length < 24) {
        res.end("2");
        return;
    }

    var id = code.substring(0, 24);
    var pwd = repairkey(code.substring(24));
    //console.log(id);
    //console.log(pwd);

    keystone.list('User').model.findOne({ _id: id }).exec(function(err, user) {
        //console.log("err:"+err);
        //console.log(hash(user.password));
        if (user && (pwd == hash(user.password))) {
            //user.getRelated("用户收藏");
            keystone.list('UserFav').model.findOne({ '所有者': id }).populate("文章列表", '_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间').exec(function(err, userFav) {
                if (err) return res.end("1");
                //console.log(userFav);
                return res.json(userFav);
            })
        } else {
            res.end("2");
        }
    });
}
