var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Picture = new keystone.List('Picture', {
    label: '图片',
    singular: '图片',
    plural: '图片',
    map: { name: '图名' }
});

Picture.add({
    '图名': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        }},
    '描述': String,
    '上传时间': { type: Date, default: Date.now, noedit:true},
    '链接': { type: String, default: '', noedit:true}
});

Picture.defaultColumns = '图名, 链接|50%, 描述';

Picture.schema.pre('save', function(next) {
    if (this.isModified('文件')) {
        this.上传时间 = new Date();
        this.链接 = '/upload/'+this.文件.filename;
    }
    next();
});

Picture.register();