var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var q = keystone.list('AppLaunch').model.findOne().where('发布', true);
    q.exec(function(err, results) {
        res.json(results);
    });
}