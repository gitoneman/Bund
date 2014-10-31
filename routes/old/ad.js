var keystone = require('keystone');
var AD = keystone.list('AD');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
        locals = res.locals;

    view.on('init', function(next) {
        AD.model.findOne()
            .where('_id', req.params.id)
            .exec(function(err, ad) {
                if (err||!ad) {
                } else {
                    locals.ad = ad;
                }
                next();
            });
    });

    view.render('phone/ad');

}