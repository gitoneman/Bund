var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Tag = new keystone.List('Tag', {
    label: '标签',
    singular: '标签',
    plural: '标签',
    map: { name: '名称' }
});

Tag.add({
    '名称': { type: String, required: true }
});

Tag.defaultColumns = '名称';

Tag.register();