var keystone = require('keystone');
var hash = require('../../lib/utils').hash;
var repairkey = require('../../lib/utils').repairkey;

exports = module.exports = function(req, res) {

    var code = req.body.c;
    var post_id = req.body.p;
    var comment = req.body.content;

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

    var id = code.substring(0, 24);
    var pwd = repairkey(code.substring(24));


    keystone.list('User').model.findOne({ _id: id }).exec(function(err, user) {
        if (user && (pwd == hash(user.password))) {
            var newPostComment = new keystone.list('PostComment').model({
                '文章': post_id,
                '作者': user.id,
                '时间': new Date(),
                '内容': comment
            });
            newPostComment.save(function(err) {
                if (err != null) {
                    res.end("3"); //提交不成功，稍后再试
                    return;
                }
                res.end("0"); //提交成功
                return;
            });
        } else {
            res.end("4"); //无效的会话key
            return;
        }
    });
}
