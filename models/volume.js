var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Volume = new keystone.List('Volume', {
    label: '叠',
    singular: '叠',
    plural: '叠',
    map: { name: '名称' }
});

Volume.add({
    '名称': { type: String, required: true},
    '分类': { type: Types.Relationship, ref: 'PostCategory'},
    '封面图': { type: Types.CloudinaryImage, autoCleanup : true},
    '文章': { type: Types.Relationship, ref: 'Post', many: true}
});

Volume.defaultColumns = '名称, 文章';

Volume.register();