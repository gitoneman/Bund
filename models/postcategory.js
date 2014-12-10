var keystone = require('keystone'),
    Types = keystone.Field.Types;

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
    '描述': String
});

PostCategory.defaultColumns = '名称, 标识, 手机列表, 描述';

PostCategory.register();
