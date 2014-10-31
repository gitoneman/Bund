var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    Post.model.findOne()
        .where('_id', req.body.post)
        .exec(function(err, post) {
            if (err||!post) {
                res.json({'state':'no post '+req.body.post});
                return;
            }
            if(post['分享数']) {
                post['分享数']++;
            } else {
                post['分享数'] = 1;
            }
            post.save(function(err) {
                if (err) {
                    res.json({'state':'save failed'});
                    return;
                }
                res.json({'state':'ok'});
                return;
            });
        });
}