var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var Post = new keystone.List('Post', {
    label: '文章',
    singular: '文章',
    plural: '文章',
    map: { name: '标题' },
    defaultSort: '-创建时间'
});

Post.add({
    '标题': { type: String, required: true },
    '副标题': { type: String },
    '原始链接': {type: Types.Url},
    '链接': { type: Types.Url},
    '来源': { type: Types.Relationship, default:'549d24707f6f4b5822e47b52', ref: 'PostSource' },
    '分类': { type: Types.Relationship, ref: 'PostCategory', many: true},
    '手机分类': { type: Types.Relationship, ref: 'PostCategory', many: true},
    '渠道': { type: Types.Relationship, ref: 'Distribution', many: true},
    '标签': { type: String},
    '状态': { type: Types.Select, options: '草稿, 已发布, 存档', default: '草稿' },
    'APP': { type: Boolean, default: false },
    '锁定': {
        '开关': { type: Boolean, default: false },
        '页号': { type: Types.Number },
        '行号': { type: Types.Number },
        '首页': { type: Boolean, default: false },
        '分类': { type: Types.Relationship, ref: 'PostCategory', many: true}
    },
    '锁定当日热门': { type: Types.Number },
    '锁定当周热门': { type: Types.Number },
    '作者': String,
    '创建时间': { type: Date, default: Date.now, noedit: true, index: true },
    '发布时间': { type: Types.Datetime, default: Date.now},
//    image: { type: Types.CloudinaryImage },
//    images: { type: Types.CloudinaryImages, wysiwyg: true },
//    '标题图片': { type: Types.Relationship, ref: 'Picture', many: true},
//    '图片': { type: Types.CloudinaryImage, autoCleanup : true},
    '缩略图': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload', allowedTypes: ['image/jpeg', 'image/png', 'image/bmp'],
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">'
        },
        filename: function(item, file) {
            return 'a'+item._id+getRandom(1000,9999)+'.'+file.extension;
        }},
    '图片链接': { type: Types.Url},
//    '图片': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
//        format: function(item, file){
//            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
//        }},
    '内容图': { type: Types.LocalFiles, dest: 'public/upload/', prefix:'/upload', allowedTypes: ['image/jpeg', 'image/png', 'image/bmp'],
        filename: function(item, filename) {
            return 'b'+item._id+getRandom(1000,9999)+require('path').extname(filename);
        },
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">';
        }},
    '正文': {
        简介: { type: Types.Html, wysiwyg: true, height: 150 },
        更多: { type: Types.Html, wysiwyg: true, height: 500 }
    },
    '赞数': { type: Types.Number, default:0, noedit: true},
    '分享数': { type: Types.Number, default:0, noedit: true},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url},
    '总点击数': {type: Types.Number, default:0, noedit: true},
    '最近点击日': {type: Date, noedit: true},
    '当日点击数': {type: Types.Number, default:0, noedit: true},
    '最近点击周': {type: Date, noedit: true},
    '当周点击数': {type: Types.Number, default:0, noedit: true}
});

//function checkThumbUp() {
//    console.log('赞数已刷新：'+this['赞'].length);
//    return this['赞'].length;
//}

//Post.model.find()
//    .where('状态', '已发布')
//    .populate('作者')
//    .sort('-创建时间')
//    .limit(1)
//    .exec(function(err, posts) {
//        // do something with posts
//        console.log('zero:');
//        console.log(posts);
//    });
//
//Post.model.find()
//    .limit(2)
//    .exec()
//    .then(function (posts) { //first promise fulfilled
//        //return another async promise
//        console.log('first:');
//        console.log(posts);
//    }, function (err) { //first promise rejected
//        throw err;
//    }).then(function (result) { //second promise fulfilled
//        //do something with final results
//        console.log('second:');
//        console.log(result);
//    }, function (err) { //something happened
//        //catch the error, it can be thrown by any promise in the chain
//        console.log(err);
//    });

Post.defaultColumns = '标题, 分类, 状态|20%, 作者, 发布时间|15%, 总点击数';

Post.schema.methods.isPublished = function() {
    return this.状态 == '已发布';
};

Post.schema.pre('save', function(next) {
    if (this.isModified('状态') && this.isPublished() && !this.发布时间) {
        this.发布时间 = new Date();
    }
    if (this.isModified('正文.更多')) {
        this.正文.更多 = this.正文.更多.replace(/\?tp=webp/g, '');
    }
    next();
});

/**
 * Relationships
 * =============
 */

Post.relationship({ ref: 'PostComment', refPath: '文章', path: '评论' });
Post.relationship({ ref: 'ThumbUp', refPath: '文章', path: '赞' });


Post.register();