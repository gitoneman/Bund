var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var PostCategory = new keystone.List('PostCategory', {
    label: '文章类别',
    singular: '文章类别',
    plural: '文章类别',
    map: { name: '名称' }
});

PostCategory.add({
    '名称': { type: String, required: true, unique: true},
    '标识': { type: String, required: true, unique: true, initial: true},
    '手机列表': { type: Types.Number},
    '描述': String,
    '图标': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, file) {
            return 'a'+item._id+getRandom(1000,9999)+'.'+file.extension;
        }},
    '显示图标': {type: Boolean, default: true},
    '焦点图': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, file) {
            return 'b'+item._id+getRandom(1000,9999)+'.'+file.extension;
        }},
    '焦点标题': String,
    '链接': { type: Types.Url},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url}
});

PostCategory.defaultColumns = '名称, 标识, 手机列表, 描述';

PostCategory.register();
