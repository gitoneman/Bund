var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var AppLaunch = new keystone.List('AppLaunch', {
    label: '手机开机',
    singular: '手机开机',
    plural: '手机开机',
    map: { name: '名称' }
});

AppLaunch.add({
    '名称': {type: String, required: true},
    '链接': { type: Types.Url},
    '图片': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">'
        },
        filename: function(item, filename) {
            return 'a'+item._id+getRandom(1000,9999)+require('path').extname(filename);
        }},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url},
    '发布': { type: Boolean, default: false},
    '宽带链接': { type: String},
    '窄带链接': { type: String},
    '网页图': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">'
        },
        filename: function(item, filename) {
            return 'b'+item._id+getRandom(1000,9999)+require('path').extname(filename);
        }},
    '网页小图': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">'
        },
        filename: function(item, filename) {
            return 'c'+item._id+getRandom(1000,9999)+require('path').extname(filename);
        }},
    '宽带网页': { type: Types.Html, wysiwyg: true, height: 500},
    '窄带网页': { type: Types.Html, wysiwyg: true, height: 500},
    '宽带小网页': { type: Types.Html, wysiwyg: true, height: 500},
    '窄带小网页': { type: Types.Html, wysiwyg: true, height: 500},
    '显示时长': { type: Types.Number, default:5 },
    '显示底栏': { type: Types.Boolean, default: 'true'},
    '标识码': { type: Types.Number, default: 0}
});

AppLaunch.defaultColumns = '名称, 链接';

AppLaunch.schema.pre('save', function(next) {
    if(this.isModified('宽带网页')) {
        this.宽带链接 = 'http://www.bundpic.com/mlaunchw/'+this._id
    }
    if(this.isModified('窄带网页')) {
        this.窄带链接 = 'http://www.bundpic.com/mlaunchn/'+this._id
    }
    if(this.isModified('网页图') || this.isModified('链接') ) {
        this.宽带网页 = "<p><a href=\'javascript:openonphone(\\\"" + this.链接 + "\\\");\'><img src=\'../../upload/" + this.网页图.filename + "\'/></a></p>";
        this.窄带网页 = "<p><a href=\'javascript:openonphone(\\\'" + this.链接 + "\\\');\'><img src=\'../../upload/" + this.网页图.filename + "\'/></a></p>";
    }
    if(this.isModified('网页小图') || this.isModified('链接') ) {
        if (this.网页小图 && this.网页小图!= null && this.网页小图.path != null && this.网页小图.path != "") {
            this.宽带小网页 = "<p><a href=\'javascript:openonphone(\\\'" + this.链接 + "\\\');\'><img src=\'../../upload/" + this.网页小图.filename + "\'/></a></p>";
            this.窄带小网页 = "<p><a href=\'javascript:openonphone(\\\'" + this.链接 + "\\\');\'><img src=\'../../upload/" + this.网页小图.filename + "\'/></a></p>";
        } else {
            this.宽带小网页 = "";
            this.窄带小网页 = "";
        }
    }
    next();
});

AppLaunch.register();