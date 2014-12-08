var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

    var number = (req.query.n)?req.query.n:20;
    var keyword = req.query.wd;
    if (keyword==null||keyword=="") {
        res.json("[]");
    }
    console.log("keyword" + keyword);
    var q = Post.model.find({'标题' : new RegExp(keyword, 'i')}).where('状态', '已发布').select('_id 标题 链接 图片 图片链接 分享数 赞数 出现统计 点击统计 发布时间').limit(number);
    q.exec(function(err, results) {
        res.json(results);
    });
}