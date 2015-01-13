var keystone = require('keystone');
var CarouselApp = keystone.list('CarouselApp');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.filters = {
        launch: req.params.id
    };

    view.on('init', function(next) {
        CarouselApp.model.findOne()
            .where('_id', locals.filters.launch)
            .exec(function(err, launch) {
                if (err) return res.err(err);
                if (!launch) return res.notfound('开机图不存在');
                locals.launch_content = launch['窄带网页'];
                next()
            });
    });

    view.render('site/mlaunch');
}