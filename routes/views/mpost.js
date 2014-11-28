var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.filters = {
        post: req.params.post
    };

    view.on('init', function(next) {

        Post.model.findOne()
            .where('_id', locals.filters.post)
            .exec(function(err, post) {
                if (err) return res.err(err);
                if (!post) return res.notfound('文章不存在');
                // Allow admins or the author to see draft posts
                if (post['状态'] == '已发布' || (req.user && req.user.canAccessKeystone) ) {
                    locals.post = post;
                    locals.page.title = post['标题'];
                    next()
                } else {
                    return res.notfound('文章不存在');
                }
            });
    });

    view.render('site/mpost');
}
