var keystone = require('keystone'),
    Types = keystone.Field.Types;

var CarouselApp = new keystone.List('CarouselApp', {
    label: '手机轮播图',
    singular: '手机轮播图',
    plural: '手机轮播图',
    map: { name: '图名' },
    defaultSort: '-优先级'
});

CarouselApp.add({
    '图名': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, filename) {
            return item._id+require('path').extname(filename);
        }},
    '发布': { type: Types.Boolean, default: 'false' },
    '描述': String,
    '上传时间': { type: Date, default: Date.now, noedit:true},
    '链接': { type: String },
    '优先级': { type: Types.Number, default: '1', required: true},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url}
});

CarouselApp.defaultColumns = '图名, 发布, 链接30%, 描述, 上传时间, 优先级, 链接';

CarouselApp.schema.pre('save', function(next) {
    if (this.isModified('文件')) {
        this.上传时间 = new Date();
    }
    next();
});

//CarouselApp.schema.post('delete', function(next) {
//
//});

CarouselApp.register();