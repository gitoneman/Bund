var keystone = require('keystone'),
    Types = keystone.Field.Types;

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
            return 'a'+item._id+filename;
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
            return 'b'+item._id+filename;
        }},
    '宽带网页': { type: Types.Html, wysiwyg: true, height: 500},
    '窄带网页': { type: Types.Html, wysiwyg: true, height: 500},
    '显示时长': { type: Types.Number, default:5 }
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
        this.宽带网页 = "<p><a href=\"javascript:openonphone('"+this.链接+"');\"><img src=\"../../upload/"+this.网页图.filename+"\"/></a></p>";
        this.窄带网页 = "<p><a href=\"javascript:openonphone('"+this.链接+"');\"><img src=\"../../upload/"+this.网页图.filename+"\"/></a></p>";
    }
    next();
});

AppLaunch.register();