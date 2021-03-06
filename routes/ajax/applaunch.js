var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var now = new Date();
    var q = keystone.list('AppLaunch').model.findOne().where("发布时间").lte(now).where("结束时间").gte(now).select('名称 链接 图片 出现统计 点击统计 宽带链接 窄带链接 显示时长 显示底栏 标识码');
    q.exec(function(err, results) {
        res.json(results);
    });
}