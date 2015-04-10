var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var CarouselAdApp = new keystone.List('CarouselAdApp', {
    label: '手机轮播图广告',
    singular: '手机轮播图广告',
    plural: '手机轮播图广告',
    map: { name: '图名' },
    defaultSort: '-优先级'
});

CarouselAdApp.add({
    '图名': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, file) {
            return item._id+getRandom(1000,9999)+'.'+file.extension;
        }},
    //'发布': { type: Types.Boolean, default: 'false' },
    '描述': String,
    '上传时间': { type: Date, default: Date.now, noedit:true},
    '生效时间': { type: Date, default: Date.now},
    '失效时间': { type: Date, default: Date.now},
    '链接': { type: String },
    '网页链接': { type: String, noedit: true},
    '网页': { type: Types.Html, wysiwyg: true, height: 500},
    '锁定位置': { type: Types.Number, default: '0', required: true},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url}
});

CarouselAdApp.defaultColumns = '图名, 发布, 链接30%, 描述, 上传时间, 优先级, 链接';

CarouselAdApp.schema.pre('save', function(next) {
    this.网页链接 =  'http://www.bundpic.com/mcarouselad/'+this._id;
    if (this.isModified('文件')) {
        this.上传时间 = new Date();
    }
    // if (this.isModified('链接') || this.isModified('描述') || this.isModified('文件')) {
        var link = ""
        if (this.链接) {
            link = "\"javascript:openonphone('"+this.链接+"');\"";
        }
        this.网页 = "<div><img src=\"../../upload/"+this.文件.filename+"\"/><div class=\"gradient\" style=\"position:absolute;left:0px;top:0px;width:100%;height:100%;background: repeating-linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%, rgba(100,100,100,0.5) 100%);\"><h3 class=\"gradient-title\" style=\"margin:30px 0px 30px;padding:0 10px 0;position:absolute;bottom:0px;color:rgb(255,255,255);font-size:18px;font-weight:500;font-family:\"黑体\";\">"+this.描述+"</h3></div><a style=\"position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;\" href="+link+">&nbsp;</a></div>"
    // }
    // console.log(this.网页);
    next();
});

//CarouselApp.schema.post('delete', function(next) {
//
//});

CarouselAdApp.register();