var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'home';

//    view.on('init', function(next) {
//
//        var q = Post.model.find().where('状态', '已发布').sort('-发布时间').limit('9');
//
//        q.exec(function(err, results) {
//            locals.posts = results;
//            next(err);
//        });
//
//    });

    // Load recent posts
    view.query('hots',
        Post.model.find()
            .where('状态', '已发布')
            .sort('-总点击数')
            .limit('10')
    );

    view.render('site/index');

}