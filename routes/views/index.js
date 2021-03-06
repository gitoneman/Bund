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
    var today = new Date();
    today.setHours(0,0,0,0);
    view.query('hots_today',
        Post.model.find()
            .where('状态', '已发布')
            .where('最近点击日', today)
            .select('标题 链接')
            .sort('-当日点击数')
            .limit('10')
    );

    var thisweek = new Date();
    thisweek.setHours(0,0,0,0);
    var day = thisweek.getDay();
    var diff = thisweek.getDate() - day + (day == 0 ? -6:1);
    thisweek.setDate(diff);
    view.query('hots_week',
        Post.model.find()
            .where('状态', '已发布')
            .where('最近点击周', thisweek)
            .select('标题 链接')
            .sort('-当周点击数')
            .limit('10')
    );

    view.query('hots_all',
        Post.model.find()
            .where('状态', '已发布')
            .select('标题 链接')
            .sort('-总点击数')
            .limit('10')
    );

    view.render('site/index');

}