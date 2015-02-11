var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var now = new Date();
    var q = keystone.list('CarouselApp').model.find().where('生效时间').lte(now).where('失效时间').gt(now).sort('-优先级').limit('10');
    q.exec(function(err, results) {
        res.json(results);
    });
}
