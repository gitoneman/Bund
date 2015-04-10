var keystone = require('keystone');
var CarouselAdApp = keystone.list('CarouselAdApp');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.filters = {
        carousel: req.params.id
    };

    view.on('init', function(next) {
        CarouselAdApp.model.findOne()
            .where('_id', locals.filters.carousel)
            .exec(function(err, carousel) {
                if (err) return res.err(err);
                if (!carousel) return res.notfound('焦点图不存在');
                locals.carousel = carousel;
                next()
            });
    });

    view.render('site/mcarousel');
}