var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

    var number = 20;
    if (req.query.n) {
        number = req.query.n;
    } else if (req.body.n) {
        number = req.body.n;
    }
    var page = 1;
    if (req.query.p) {
        page = req.query.p;
    } else if (req.body.p) {
        page = req.body.p;
    }
    var keyword = null;
    if (req.query.wd) {
        keyword = req.query.wd
    } else if (req.body.wd) {
        keyword = req.body.wd
    }

    if (keyword==null||keyword=="") {
        res.json("[]");
    }
    //console.log("keyword" + keyword);
    var kw = new RegExp(keyword, 'i');
    var q = Post.model.find({ $or: [ {'标题' : kw}, { '作者': kw } ] }).where('状态', '已发布').select('_id 标题 链接 图片 图片链接 缩略图 分享数 赞数 出现统计 点击统计 发布时间').skip((page-1)*number).limit(number);
    q.exec(function(err, results) {
        res.json(results);
    });
}