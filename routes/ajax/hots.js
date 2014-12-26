var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

    var type = (req.query.t)?req.query.t:0;
    var number = (req.query.n)?req.query.n:10;
    number = (number>30)?30:number;

    var q = Post.model.find().where('状态', '已发布').select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间 总点击数 当日点击数 当周点击数').limit(number);
    if (type == 1) {
        //today hots
        var today = new Date();
        today.setHours(0,0,0,0);
        q.where('最近点击日', today).sort('-当日点击数');
    } else if (type == 2) {
        //this week hots
        var thisweek = new Date();
        thisweek.setHours(0,0,0,0);
        var day = thisweek.getDay();
        var diff = thisweek.getDate() - day + (day == 0 ? -6:1);
        thisweek.setDate(diff);
        q.where('最近点击周', thisweek).sort('-当周点击数');
    } else {
        q.sort('-总点击数');
    }
    q.exec(function(err, results) {
        res.json(results);
    });
}