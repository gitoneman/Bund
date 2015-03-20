var RSS = require('rss');
var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {

    var feed = new RSS({
        title: '外滩daily',
        site_url: 'http://www.bundpic.com',
        feed_url: 'http://www.bundpic.com/rss/daily.xml',
        description: '外滩daily',
        language: 'zh-cn',
        webMaster: 'yinz@me.com',
        copyright: '2015 外滩传媒'
        pubDate: new Date(),
        generator: '上海外滩画报传媒有限公司'
    });

    var q = Post.model.find().where('状态', '已发布').select('_id 标题 发布时间 正文').limit(10);
    var today = new Date();
    today.setHours(0,0,0,0);
    q.where('最近点击日', today).sort('-当日点击数');
    q.exec(function(err, results) {
        for(var i=0; i< results.length;++i) {
            console.log(results[i].发布时间);
            console.log(results[i].正文.简介);
            console.log(results[i].正文.更多);
            feed.item({
                title: results[i].标题,
                url: 'http://www.bundpic.com/posts/post/'+results[i]._id,
                guid: 'http://www.bundpic.com/posts/post/'+results[i]._id,
                date: results[i].发布时间,
                description: results[i].正文.简介,
                custom_elements: [
                    {'content': results[i].正文.更多}]
            });
        }
        res.send(feed.xml({indent: true}));
    });

    /* loop over data and add to feed */


// cache the xml to send to clients
//    var xml = feed.xml();
//    res.send(feed.xml({indent: true}));
//    //res.end("0");
//
//    var type = (req.query.t)?req.query.t:0;
//    var number = (req.query.n)?req.query.n:10;
//    number = (number>30)?30:number;
//
//    var q = Post.model.find().where('状态', '已发布').select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间 来源').populate('来源', '名称').limit(number);
//    if (type == 1) {
//        //today hots
//        var today = new Date();
//        today.setHours(0,0,0,0);
//        q.where('最近点击日', today).sort('-当日点击数');
//    } else if (type == 2) {
//        //this week hots
//        var thisweek = new Date();
//        thisweek.setHours(0,0,0,0);
//        var day = thisweek.getDay();
//        var diff = thisweek.getDate() - day + (day == 0 ? -6:1);
//        thisweek.setDate(diff);
//        q.where('最近点击周', thisweek).sort('-当周点击数');
//    } else {
//        q.sort('-总点击数');
//    }
//    q.exec(function(err, results) {
//        res.json(results);
//    });
}