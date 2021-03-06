var keystone = require('keystone');
var AppLaunch = keystone.list('AppLaunch');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.filters = {
        launch: req.params.id
    };

    view.on('init', function(next) {
        AppLaunch.model.findOne()
            .where('_id', locals.filters.launch)
            .exec(function(err, launch) {
                if (err) return res.err(err);
                if (!launch) return res.notfound('开机图不存在');
                locals.launch_content = launch['宽带网页'];
                locals.launch_content_s = launch['宽带小网页'];
                next();
            });
    });

    view.render('site/mlaunch');
}