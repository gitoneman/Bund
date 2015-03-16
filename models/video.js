var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Video = new keystone.List('Video', {
    label: '视频',
    singular: '视频',
    plural: '视频',
    map: { name: '名称' }
});

Video.add({
    '名称': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload', allowedTypes: ['video/mp4'],
        filename: function(item, file) {
            return item._id+'.'+file.extension;
        }},
    '地址': { type: String, noedit: true }
});

Video.defaultColumns = '名称, 地址';

Video.schema.pre('save', function(next) {
    this.地址 = "http://www.bundpic.com/upload/"+ this.文件.filename;
    next();
});

Video.register();