var keystone = require('keystone');
var ThumbUp = keystone.list('ThumbUp');

exports = module.exports = function(req, res) {

    var act = req.query.act;
    var post_id = req.query.p;
    var code = req.body.c;

    if (act != 1 && act !=2 && act != 3) {
        return res.end("2")
    }

    //1 缺少文章id
    if (post_id == null || post_id.length < 24) {
        res.end("3");
        return;
    }

    if (act == "1") {
        keystone.list('Post').model.findOne().where('_id', post_id).select('赞数').exec(function(err, post) {
            if (err) return res.end("1");
            if (!post) return res.end("4");
            return res.end(post);
        });
        return;
    }

    if (code == null || code.length < 24) {
        res.end("5");
        return;
    }

    var id = code.substring(0, 24);
    var pwd = code.substring(24);

    keystone.list('User').model.findOne({ id: id }).exec(function(err, user) {
        if (user && (pwd == hash(user.password))) {
            keystone.list('ThumbUp').model.findOne({ '文章': post_id, '作者': id }, function(err, thumbup) {
                if (err) return res.end("1");
                if (thumbup) {
                    if (act == "3") {
                        thumbup.remove(function (err) {
                            if (err) return res.end("1");
                            keystone.list('Post').model.findOne().where('_id', post_id).exec(function(err, post) {
                                if (err) return res.end("1");
                                if (!post) return res.end("4");
                                post['赞数']--;
                                post.save(function(err) {
                                    if (err) return res.end("1");
                                    return res.end("0")
                                });
                            });
                        });
                    } else {
                        return res.end("7");
                    }
                } else {
                    if (act == "2") {
                        var newThumbUp = new ThumbUp.model({
                            '文章': locals.post.id,
                            '作者': locals.user.id
                        });
                        newThumbUp.save(function(err) {
                            if (err) return res.end("1");
                            keystone.list('Post').model.findOne().where('_id', post_id).exec(function(err, post) {
                                if (err) return res.end("1");
                                if (!post) return res.end("4");
                                post['赞数']++;
                                post.save(function(err) {
                                    if (err) return res.end("1");
                                    return res.end("0")
                                });
                            });
                        });
                    } else {
                        return res.end("7");
                    }
                }
            });
        }
        else {
            res.end("6"); //无效的会话key
            return;
        }
    });
}
