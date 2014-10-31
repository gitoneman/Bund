var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Distribution = new keystone.List('Distribution', {
    label: '发布渠道',
    singular: '发布渠道',
    plural: '发布渠道',
    map: { name: '名称' }
});

Distribution.add({
    '名称': { type: String, required: true},
    '描述': String
});

Distribution.defaultColumns = '名称, 描述';

Distribution.register();