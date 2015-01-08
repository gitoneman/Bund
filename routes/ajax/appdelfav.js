var keystone = require('keystone');
var hash = require('../../lib/utils').hash;
var repairkey = require('../../lib/utils').repairkey;
var UserFav = keystone.list('UserFav');

exports = module.exports = function(req, res) {

    var code = req.query.c;
    var post_id = req.query.p;
    //1 缺少key
    if (code == null || code.length < 24) {
        res.end("1");
        return;
    }
    //2 缺少文章id
    if (post_id == null || post_id.length < 24) {
        res.end("2");
        return;
    }
    //console.log(code);
    var id = code.substring(0, 24);
    var pwd = repairkey(code.substring(24));

    //console.log(id);
    //console.log(pwd);

    keystone.list('User').model.findOne({ _id: id }).exec(function(err, user) {
        if (user && (pwd == hash(user.password))) {
            UserFav.model.findOne({ '所有者': user.id }).exec(function(err, userFav) {
                if (userFav) {
                    var posts = userFav['文章列表']
                    var index = posts.indexOf(post_id);
                    if (index == -1) {
                        posts.splice(index, 1);
                        userFav.save(function(err) {
                            if (err != null) {
                                res.end("3"); //提交不成功，稍后再试
                                return;
                            }
                            res.end("0"); //提交成功
                            return;
                        });
                    } else {
                        res.end("5"); //已经收藏过
                    }
                } else {
                    return res.end("5") //文章没有收藏过
                }
            });
        } else {
            res.end("4"); //无效的会话key
            return;
        }
    });
}