var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var q = keystone.list('PostCategory').model.find().where('手机列表').gt(0).select('名称 标识').sort('-手机列表');
    q.exec(function(err, results) {
        res.json(results);
    });
}
