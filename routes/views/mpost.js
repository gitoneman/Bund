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
            .populate('来源', '名称 图标')
            .exec(function(err, post) {
                if (err) return res.err(err);
                if (!post) return res.notfound('文章不存在');
                // Allow admins or the author to see draft posts
                if (post['状态'] == '已发布' || (req.user && req.user.canAccessKeystone) ) {
                    //统计
                    post['总点击数']++;
                    var today = new Date()
                    today.setHours(0,0,0,0);
                    if(post['最近点击日']==null||post['最近点击日']<today) {
                        post['最近点击日'] = today
                        post['当日点击数'] = 1;
                    } else {
                        post['当日点击数']++;
                    }
                    var thisweek = new Date();
                    thisweek.setHours(0,0,0,0);
                    var day = thisweek.getDay();
                    var diff = thisweek.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
                    thisweek.setDate(diff);
                    if(post['最近点击周']==null||post['最近点击周']<thisweek) {
                        post['最近点击周'] = thisweek;
                        post['当周点击数'] = 1;
                    } else {
                        post['当周点击数']++;
                    }
                    post.save(function(err) {
                        if (err) console.log(err);
                    });
                    
                    locals.post = post;
                    locals.page.title = post['标题'];
                    next();
                } else {
                    return res.notfound('文章不存在');
                }
            });
    });

    view.render('site/mpost');
}
