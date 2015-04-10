var keystone = require('keystone');
var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:12;
    var category = req.query.c;
    var app = (req.query.a)?req.query.a:false;

    var q = Post.model.find().where('锁定.开关').ne(true).where("发布时间").lt(new Date()).select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间 来源').populate('来源', '名称').sort('-发布时间').skip((page-1)*number).limit(number);
    var q2 = Post.model.find().where('锁定.开关', true).where('锁定.页号', page).select('_id 标题 链接 缩略图 图片链接 分享数 赞数 出现统计 点击统计 发布时间 来源 锁定').populate('来源', '名称').sort('锁定.行号').limit(number);
    if (!app) {
        q.where('APP', true);
        q2.where('APP', true);
    }
    if(category&&category!='') {
        keystone.list('PostCategory').model.findOne({ '标识': category }).exec(function(err, result) {
            //console.log(result);
            if(result) {
                q.where('手机分类').in([result]);
            }
            q.exec(function(err, results) {
                q2.find({'锁定.分类': result});
                q2.exec(function(err, results2) {
                    for(var i=0;i<results2.length;++i) {
                        var pos = results2[i]['锁定']['行号'];
                        results.splice(pos-1, 0, results2[i]);
                    }
                    res.json(results);
                });
            });
        });
    } else {
        q.exec(function(err, results) {
            q2.find().where('锁定.首页', true);
            q2.exec(function(err, results2) {
                for(var i=0;i<results2.length;++i) {
                    var pos = results2[i]['锁定']['行号'];
                    results.splice(pos-1, 0, results2[i]);
                }
                res.json(results);
            });
        });
    }
}
