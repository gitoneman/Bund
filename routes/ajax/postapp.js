var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;
    var category = req.query.c;
    var q = Post.model.find().where('APP', true).where('AD').ne(true).where("发布时间").lt(new Date()).select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间 来源').populate('来源', '名称').sort('-发布时间').skip((page-1)*number).limit(number);
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
