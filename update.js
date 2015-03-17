require('dotenv').load();
var spider = require('./lib/yspider');
var moment = require('moment');
var async = require('async');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

var postModel = mongoose.model('Post', {
    '标题': String,
    '副标题': String,
    '原始链接': String,
    '分类': [mongoose.Schema.Types.ObjectId],
    '渠道': mongoose.Schema.Types.ObjectId,
    '标签': String,
    '状态': String,
    '作者': String,
    '创建时间': Date,
    '发布时间': Date,
    '图片链接': String,
    '正文': {
        '简介': String,
        '更多': String
    }
});

var categoryModel = mongoose.model('PostCategory', {
    '名称': String,
    '标识': String,
    '描述': String
});
//
//var kitty = new Cat({ name: 'Zildjian' });
//kitty.save(function (err) {
//    if (err) // ...
//        console.log('meow');
//});

var spiderworkder;
var categoryStore;
var isUpdate = true;
var isFirst = true;

function dumpError(err) {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
}

//
//
////TODO:文章分类抓取，文章作者
//
//
// this = {params:{ year: '2014', month: '09', n: '56261' },splats: [],route: '/:year/:month/:n.shtml',spider:{urls:[as a stack]},response:{headers:{},body:''},
// url:{host: 'www.bundpic.com',port: null,pathname: '/2014/09/56261.shtml',path: '/2014/09/56261.shtml',href: 'http://www.bundpic.com/2014/09/56261.shtml'}}

var crawlpost = function (next) {
    if (this.fromCache) return;
    var $ = this.$;
    var url = this.spider.currentUrl;
    //console.log(url);
    var title;
    $('div.cc h1:first').each(function () {
        title = this.childNodes[1].nodeValue;
        console.log(title);
    })
    var category;
    $('p.location a:eq(1)').each(function () {
        category = this.innerHTML;
//                console.log("category=" + category);
    })
    var label;
    $('p.location a:eq(2)').each(function () {
        label = this.innerHTML;
//                console.log("label=" + label);
    })
    var period;
    $('div.cc p.date').each(function () {
        period = this.innerHTML;
    })
    var sub_title;
    $('div.cc h1 s').each(function () {
        sub_title = this.innerHTML;
    })
    var cinfo;
    $('div.cc p.cinfo').each(function () {
        cinfo = this.innerHTML;
    })
    var intro;
    $('div.cc p.intro').each(function () {
        intro = this.innerHTML;
    })
    var content;
    $('div.cc div.ccontent').each(function () {
        content = this.innerHTML;
    })
    var pic;
    $('div.cc div.ccontent img:first').each(function () {
        pic = this.src;//?this.src.replace('www.bundpic.com',old_ip):'';
    })
    var ptime = period.split(' ', 2)[0].replace('年', '').replace('月', '').replace('日', '');
    var time = moment(ptime, 'YYYYMMDD').toDate();
    if (label!=null&&label!=""&&!categoryStore[label]) {
        var newCategory = new categoryModel({
            '名称': label,
            '标识': label,
            '描述': ""
        });
        newCategory.save(function (err, data) {
            if (err) console.log(err);
            else {
                categoryStore[label] = data._id;
                var newPost = {
                    '标题': title,
                    '副标题': sub_title ? sub_title : '',
                    '原始链接': url,
                    '分类': [categoryStore[category],categoryStore[label]],
                    '标签': label ? label : '',
                    '状态': '已发布',
                    '作者': cinfo ? cinfo : '',
                    '创建时间': time,
                    '发布时间': time,
                    '图片链接': pic ? pic : '',
                    '正文': {
                        '简介': intro ? intro : '',
                        '更多': content ? content : ''
                    }
                };
                postModel.update({ '原始链接': url }, newPost, {upsert: true}, function (err, numberAffected, raw) {
                    if (err) console.log(err);
                    next();
                });
            }
        });
    } else {
        var cate;
        if (categoryStore[label]) {
            cate = [categoryStore[category], categoryStore[label]];
        } else {
            cate = [categoryStore[category]];
        }
        var newPost = {
            '标题': title,
            '副标题': sub_title ? sub_title : '',
            '原始链接': url,
            '分类': cate,
            '标签': label ? label : '',
            '状态': '已发布',
            '作者': cinfo ? cinfo : '',
            '创建时间': time,
            '发布时间': time,
            '图片链接': pic ? pic : '',
            '正文': {
                '简介': intro ? intro : '',
                '更多': content ? content : ''
            }
        };
        postModel.update({ '原始链接': url }, newPost, {upsert: true}, function (err, numberAffected, raw) {
            if (err) console.log(err);
            next();
        });
    }
}

var doCrawl = function () {
    var old_ip = process.env.OLD_SERVER_IP;
    spiderworkder = spider();
    spiderworkder
        .route(old_ip, '/:year/:month/:n.shtml', crawlpost)
        .route(old_ip, '/link_list.php*', function (next) {
            var url = this.spider.currentUrl;
            if (this.fromCache) return;
            var $ = this.$;
            console.log("Fetching page: " + url);
            $('div.txt h3 a').each(function () {
                spiderworkder.spider($(this).attr('href'));
            })
            if(!isUpdate) {
                $('img[src="images/page_next.png"]').closest('a').each(function () {
                    spiderworkder.spider($(this).attr('href'));
                })
            }
            next();
        })
        .route(old_ip, '/travel.php*', function (next) {
            var url = this.spider.currentUrl;
            if (this.fromCache) return;
            var $ = this.$;
            console.log("Fetching page: " + url);
            $('div.txt h3 a').each(function () {
                spiderworkder.spider($(this).attr('href'));
            })
            if(!isUpdate) {
                $('img[src="images/page_next.png"]').closest('a').each(function () {
                    spiderworkder.spider($(this).attr('href'));
                })
            }
            next();
        })
        .route(old_ip, '/*.php', function (next) {
            var $ = this.$;
            if (this.fromCache) return;
            $('div.nav2 div a').each(function () {
                spiderworkder.spider($(this).attr('href'));
            });
            next();
        })
        .route(old_ip, '/', function (next) {
            var $ = this.$;
            if (this.fromCache) return;
            $('div.nav ul li a').each(function () {
                spiderworkder.spider($(this).attr('href'));
            });
            next();
        })
        .log('info')
        .get('http://'+old_ip+'/');
//        .get('http://112.124.97.208/2007/12/1646.shtml', function() {
//            console.log('ALL Done!==================================================');
//        });
};

var Update_From_Old = function () {
    async.series([
        function(callback){
            postModel.findOne()
                .exec(function(err, post) {
                    if (err) {
                        console.log('err');
                    }
                    if (!post) {
                        isUpdate = false;
                    } else {
                        if(isFirst&&process.env.FULL_CRAWL=='true') {
                            isUpdate = false;
                        } else {
                            isUpdate = true;
                        }
                    }
                    isFirst = false;
                    callback(null, null);
                });
        },
        function(callback){
//            var PostCategory = keystone.list('PostCategory');
            if(!categoryStore) {
                categoryModel.find()
                    .exec(function (err, category) {
                        if (err) {
                            console.log('err');
                            return;
                        }
                        categoryStore = new Object();
                        for(var i=0; i< category.length; ++i) {
                            categoryStore[category[i]['名称']] = category[i].id;
                        }
                        callback(null, null);
                    });
            } else {
                callback(null, null);
            }
        },
        doCrawl
    ]);
};

//var last_moment;
console.log(new Date());
var job = new CronJob({
    //Seconds: 0-59
    //Minutes: 0-59
    //Hours: 0-23
    //Day of Month: 1-31
    //Months: 0-11
    //Day of Week: 0-6 0 for sunday
    //Asterisk. E.g. *
    //Ranges. E.g. 1-3,5
    //Steps. E.g. */2
    cronTime: process.env.UPDATE_MIN,
    onTick: function() {
        //var now = moment();
        //console.log("ticking:"+now.format("hh:mm:ss"));
        //if(!last_moment||moment.duration(now.diff(last_moment)).asSeconds()>100) {
        //    last_moment = now;
            console.log("ticking:"+new Date());
            Update_From_Old();
        //}
    },
    start: false
});
job.start();
