var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var PostSource = new keystone.List('PostSource', {
    label: '文章来源',
    singular: '文章来源',
    plural: '文章来源',
    map: { name: '名称' }
});

PostSource.add({
    '名称': { type: String, required: true, unique: true},
    '描述': String,
    '图标': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 200px">'
        },
        filename: function(item, file) {
            return 'a'+item._id+getRandom(1000,9999)+'.'+file.extension;
        }}
});

PostSource.defaultColumns = '名称, 描述';

PostSource.register();
