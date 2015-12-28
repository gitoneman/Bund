var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;

    var q = Post.model.find().select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间').sort('-发布时间').skip((page-1)*number).limit(number);
    q.exec(function(err, results) {
        res.json(results);
    });
}
