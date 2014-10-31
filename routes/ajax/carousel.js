var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var q = keystone.list('Carousel').model.find().where('发布', 'true').sort('-优先级').limit('10');
    q.exec(function(err, results) {
        res.json(results);
    });
}