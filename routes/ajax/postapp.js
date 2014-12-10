var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;
    var category = req.query.c;
    var q = Post.model.find().where('状态', '已发布').select('_id 标题 链接 图片 图片链接 分享数 赞数 出现统计 点击统计 发布时间').sort('-发布时间').skip((page-1)*number).limit(number);
    if(category&&category!='') {
        keystone.list('PostCategory').model.findOne({ '标识': category }).exec(function(err, result) {
            if(result) {
                q.where('分类').in([result]);
            }
            q.exec(function(err, results) {
                res.json(results);
            });
        });
    } else {
        q.exec(function(err, results) {
            res.json(results);
        });
    }
}