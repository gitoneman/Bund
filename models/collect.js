var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Collect = new keystone.List('Collect', {
    label: '搜集',
    singular: '搜集',
    plural: '搜集',
    map: { name: '项目' }
});

Collect.add({
    '项目': { type: String, required: true},
    '姓名': { type: String },
    '性别': { type: Types.Select, options: '男, 女'},
    '电话': { type: String },
    '邮箱': { type: String },
    '省': {type: String },
    '市': {type: String },
    '车型': {type: String },
    '购车时间': {type: String },
    '预算': {type: String}
});

Collect.defaultColumns = '项目, 姓名, 性别, 电话, 邮箱, 省, 市, 车型, 购车时间, 预算';

Collect.register();