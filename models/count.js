var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Count = new keystone.List('Count', {
    label: '计数',
    singular: '计数',
    plural: '计数',
    map: { name: 'name' }
});

Count.add({
    'name': { type: String, required: true, label: '名称'},
    'count': {type: Types.Number, default:0, noedit: true, label: '计数'}
});

Count.defaultColumns = 'name, count';

Count.register();