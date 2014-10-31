var spider = require('./ycrawler');
//var keystone = require('keystone');
var moment = require('moment');
var async = require('async');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:28933/bund');

var postModel = mongoose.model('Post', {
    '标题': String,
    '副标题': String,
    '分类': mongoose.Schema.Types.ObjectId,
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

//var old_ip = '112.124.97.208';
var old_ip = '10.161.157.71';
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

var crawlpost = function (window, $, saved) {
    try {
        if (this.fromCache) return;
//    console.log("Fetching page: " + this.spider.currentUrl);
        var url = this.spider.currentUrl;
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
//            console.log(pic);

        var ptime = period.split(' ', 2)[0].replace('年', '').replace('月', '').replace('日', '');
        var time = moment(ptime, 'YYYYMMDD').toDate();

//    var Post = keystone.list('Post');

        var newPost = {
            '标题': title,
            '副标题': sub_title ? sub_title : '',
            '分类': categoryStore[category],
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
//        console.log("writing:"+title);
        postModel.update({ '标题': title }, newPost, {upsert: true}, function (err, numberAffected, raw) {
            if (err) console.log(err);
            saved();
//        console.log('The number of updated documents was %d', numberAffected);
//        console.log('The raw response from Mongo was ', raw);
        });

    } catch (err) {
        dumpError(err);
    }
//    async.series(
//        {
//            none: function(callback)
//            {
//                // do some more stuff ...
//                Post.model.findOne()
//                    .where('标题', title)
//                    .exec(function (err, post) {
//                        if (err) {
//                            callback(err, null);
//                            return;
//                        }
//                        if (post) {
//                            console.log('This not new post');
//                            callback('Post exist', null);
//                            return;
//                        }
//                        callback(null, null);
//                    });
//            }
//            ,
//            cid: function (callback) {
//                PostCategory.model.findOne()
//                    .where('名称', category)
//                    .exec(function (err, c) {
//                        if (err) {
//                            callback(err, []);
//                            return;
//                        }
//                        if (c) {
//                            callback(null, [c.id]);
//                        } else {
//                            callback(null, []);
//                        }
//                        callback(null, c);
//                    });
//                }
//        },
//            // optional callback
//        function(err, results){
//            // results is now equal to ['one', 'two']
//            if(!err) {
//                new Post.model({
//                    '标题': title,
//                    '副标题': sub_title,
//                    '分类': results['cid'],
//                    '标签': label,
//                    '状态': '已发布',
//                    '作者': cinfo,
//                    '创建时间': time,
//                    '发布时间': time,
//                    '图片链接': pic,
//                    '正文': {
//                        '简介': intro,
//                        '更多': content
//                    }
//                }).save(function(err) {
//                        if(err) {
//                            console.log(err);
//                        } else {
//                            console.log('New post added');
//                        }
//                    });
//            }
//        });
//    var Post = keystone.list('Post');
//    Post.model.findOne()
//        .where('标题', title)
//        .exec(function(err, post) {
//            if (err) {
//                console.log(err);
//                return;
//            }
//            if (post) {
//                console.log('This not a new post');
//                return;
//            }
//            console.log('New post+++++++++++++++++++');
//
//
//            var PostCategory = keystone.list('PostCategory');
//            PostCategory.model.findOne()
//                .where('名称', category)
//                .exec(function (err, c) {
//                    if (err) {
//                        console.log(err);
//                        return;
//                    }
//                    new Post.model({
//                        '标题': title,
//                        '副标题': sub_title,
//                        '分类': c?[c.id]:[],
//                        '标签': label,
//                        '状态': '已发布',
//                        '作者': cinfo,
//                        '创建时间': time,
//                        '发布时间': time,
//                        '图片链接': pic,
//                        '正文': {
//                            '简介': intro,
//                            '更多': content
//                        }
//                    }).save(function(err) {
//                            if(err) {
//                                console.log(err);
//                            } else {
//                                console.log('New post added');
//                            }
//                        });
//                });
            // Allow admins or the author to see draft posts
//            var category_ids = new Array();
//            var tag_ids = new Array();
//            async.parallel({
//                category_id: function(cb)
//                {
//                    var PostCategory = keystone.list('PostCategory');
//                    PostCategory.model.findOne()
//                        .where('名称', category)
//                        .exec(function (err, c) {
//                            if (err) {
//                                console.log(err);
//                                return;
//                            }
//                            if (!c) {
//                                console.log('category not exists!')
//                                var pc = new PostCategory.model({
//                                    '名称': category
//                                });
//                                pc.save(function (err) {
//                                    if (err) {
//                                        return;
//                                    }
//                                    cb(null, pc.id);
////                                            category_ids.push(pc.id);
//                                    return;
//                                });
//                            } else {
//                                cb(null, c.id);
////                                        category_ids.push(c.id);
//                            }
//                        });
//                },
//                tag_id: function (cb) {
//                    var Tag = keystone.list('Tag');
//                    Tag.model.findOne()
//                        .where('名称', label)
//                        .exec(function (err, l) {
//                            if (err) {
//                                console.log(err);
//                                return;
//                            }
//                            if (!l) {
//                                console.log('Tag not exists!')
//                                var lc = new Tag.model({
//                                    '名称': label
//                                });
//                                lc.save(function (err) {
//                                    if (err) {
//                                        return;
//                                    }
//                                    cb(null, lc.id);
////                                            tag_ids.push(lc.id);
//                                    return;
//                                });
//                            } else {
//                                cb(null, l.id);
////                                        tag_ids.push(l.id);
//                            }
//                        });
//                }
//            }, function (err, results) {
//                var category_ids = [results.category_id];
//                var tag_ids = [results.tag_id];
////                        console.log(category_ids);
////                        console.log(tag_ids);
//                new Post.model({
//                    '标题': title,
//                    '副标题': sub_title,
//                    '分类': category_ids,
//                    '标签': tag_ids,
//                    '状态': '已发布',
//                    '作者': cinfo,
//                    '创建时间': time,
//                    '发布时间': time,
//                    '图片链接': pic,
//                    '正文': {
//                        '简介': intro,
//                        '更多': content
//                    }
//                }).save(function(err) {
//                        if(err) {
//                            console.log(err);
//                        } else {
//                            console.log('New post added');
//                        }
//                    });
//            });

//        });
}

var pagepost = function (window, $, saved) {
    try {
    var url = this.spider.currentUrl;
    if (this.fromCache) return;
    console.log("Fetching page: " + url);
    $('div.txt h3 a').spider();
    if(!isUpdate) {
        $('img[src="images/page_next.png"]').closest('a').spider();
    }
        saved();
} catch (err) {
    dumpError(err);
}

//    var next = $('img[src="images/page_next.png"]').closest('a').attr('href');
//    console.log();
//    var nextLink = $.extend(true, {}, $('img[src="images/page_next.png"]').closest('a'));
//    var Post = keystone.list('Post');
//    if(!Post) {
//        console.log('Post is null');
//        return;
//    }

//    function spiderNext() {
//        $('img[src="images/page_next.png"]').closest('a').spider();
//    }
//    var doNext = false;
//    $('div.txt h3 a').spider();
//    var next = false;
//    async.series([
//        function(callback){
//            $('div.txt h3 a:first').each(function () {
//                var title = this.childNodes[1].nodeValue;
//                Post.model.findOne()
//                    .where('标题', title)
//                    .exec(function(err, post) {
//                        console.log('got checked');
//                        if (err) {
//                            console.log('err');
//                            return;
//                        }
//                        if (!post) {
//                            next = true;
////                        console.log('get next page: '+url);
////                        spiderNext();
//                        }
//                        console.log('next is:'+next);
//                        callback(null);
//                    });
//            });
//        },
//        function(callback){
//            console.log('run next is:'+next);
//            if(next) {
//                console.log('get next page: '+url);
//                $('img[src="images/page_next.png"]').closest('a').spider();
//            }
//            callback(null);
//        }
//    ]);

//    $.merge($('div.txt h3 a:first'), $('img[src="images/page_next.png"]').closest('a')).each(function () {
//        if(this.childNodes[1]) {
//            var title = this.childNodes[1].nodeValue;
//            Post.model.findOne()
//                .where('标题', title)
//                .exec(function(err, post) {
//                    if (err) {
//                        console.log('err');
//                        return;
//                    }
//                    if (!post) {
//                        next = true;
////                        console.log('get next page: '+url);
////                        spiderNext();
//                    }
//                });
//        } else {
//            console.log('get next page: '+url);
//            if(next) $(this).spider();
//        }
//    });

//    async.each($('div.txt h3 a:first'), function (node, callback) {
//        var title = node.childNodes[1].nodeValue;
////        console.log(title);
//        $(node).spider();
//        Post.model.findOne()
//            .where('标题', title)
//            .exec(function(err, post) {
//                if (err) {
//                    console.log('err');
//                    callback();
//                    return;
//                }
//                if (!post) {
//                    doNext = true;
//                }
//                callback();
//            });
//    }, function (err) {
//        if( err ) {
//            console.log('list process err');
//            return;
//        }
//        if(doNext) {
////            spiderworkder.get('http://112.124.97.208/'+next);
//            nextLink.spider();
//        }
//    });
}

var doCrawl = function () {
    try{
    spiderworkder = spider();
    spiderworkder
        .route(old_ip, '/:year/:month/:n.shtml', crawlpost)
        .route(old_ip, '/link_list.php*', pagepost)
        .route(old_ip, '/*.php', function (window, $, saved) {
            if (this.fromCache) return;
            $('div.nav2 div a').spider();
            saved();
        })
        .route(old_ip, '/', function (window, $, saved) {
            if (this.fromCache) return;
            $('div.nav ul li a').spider();
            saved();
        })
        .log('info')
        .get('http://'+old_ip+'/', function() {
            console.log('ALL Done!==================================================');
        });
//        .get('http://112.124.97.208/2007/12/1646.shtml', function() {
//            console.log('ALL Done!==================================================');
//        });
} catch (err) {
    dumpError(err);
}
}

var Update_From_Old = function () {
    try{
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
                        if(isFirst&&process.argv[3]) {
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
} catch (err) {
    dumpError(err);
}
}

module.exports = function() {
    try{
        var start_min = process.argv[2] || '00';
    var last_moment;
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
        cronTime: '00 '+start_min+' * * * *',//15
        onTick: function() {
            var now = moment();
//            console.log("ticking:"+now.format("hh:mm:ss"));
            if(!last_moment||moment.duration(now.diff(last_moment)).asSeconds()>3500) {
                last_moment = now;
                console.log("ticking:"+new Date());
                Update_From_Old();
            }
        },
        start: false
    });
    job.start();
} catch (err) {
    dumpError(err);
        console.log('make a change');
}
}
