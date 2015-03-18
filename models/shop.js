var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var Shop = new keystone.List('Shop', {
    label: '小店',
    singular: '小店',
    plural: '小店',
    map: { name: '店名' }
});

Shop.add({
    '店名': { type: String, required: true},
    '电话': { type: String },
    '地址': { type: String },
    '时间': { type: String },
    '图片': { type: Types.LocalFiles, dest: 'public/upload/', prefix:'/upload', allowedTypes: ['image/jpeg', 'image/png', 'image/bmp'],
        filename: function(item, filename) {
            return item._id+getRandom(1000,9999)+require('path').extname(filename);
        },
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">';
        }},
    '标签': { type: Types.Relationship, ref: 'ShopCategory', many: true},
    '描述': { type: Types.Textarea, height: 150 },
    '来源链接': { type: Types.TextArray},
    '来源标题': { type: Types.TextArray},
    '大众点评链接': { type: Types.Url}
});

Shop.defaultColumns = '店名, 电话, 描述';

Shop.register();