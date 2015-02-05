var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var q = keystone.list('PostCategory').model.find().where('手机列表').gt(0).select('名称 标识 图标 显示图标 焦点图 焦点标题 链接 出现统计 点击统计').sort('-手机列表');
    q.exec(function(err, results) {
        res.json(results);
    });
}
