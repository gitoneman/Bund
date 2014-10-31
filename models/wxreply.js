var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Wxreply = new keystone.List('Wxreply', {
    label: '微信自动回复',
    singular: '微信自动回复',
    plural: '微信自动回复',
    map: { name: '名称' }
});

Wxreply.add({
    '名称': { type: String, required: true},
    '微信号': { type: Types.Relationship, ref: 'Wxacc', many: true, initial: true},
    '关键词': { type: String, initial: true},
    '文章': { type: Types.Relationship, ref: 'Post', many: true, initial: true}
});

Wxreply.defaultColumns = '名称, 微信号, 关键词, 文章';

Wxreply.register();