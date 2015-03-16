var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var Carousel = new keystone.List('Carousel', {
    label: '轮播图',
    singular: '轮播图',
    plural: '轮播图',
    map: { name: '图名' },
    defaultSort: '-优先级'
});

Carousel.add({
    '图名': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, file) {
            return item._id+getRandom(1000,9999)+'.'+file.extension;
        }},
    '发布': { type: Types.Boolean, default: 'false' },
    '描述': String,
    '上传时间': { type: Date, default: Date.now, noedit:true},
    '链接': { type: String },
    '优先级': { type: Types.Number, default: '1', required: true}
});

Carousel.defaultColumns = '图名, 发布, 链接30%, 描述, 上传时间, 优先级, 链接';

Carousel.schema.pre('save', function(next) {
    if (this.isModified('文件')) {
        this.上传时间 = new Date();
    }
    next();
});

Carousel.register();