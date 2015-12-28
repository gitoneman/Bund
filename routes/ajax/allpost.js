var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;

    var q = Post.model.find().select('_id 标题 链接 发布时间').skip((page-1)*number).limit(number);
    q.exec(function(err, results) {
        res.json(results);
    });
}
