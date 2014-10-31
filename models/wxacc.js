var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Wxacc = new keystone.List('Wxacc', {
    label: '微信号',
    singular: '微信号',
    plural: '微信号',
    map: { name: '名称' }
});

Wxacc.add({
    '名称': { type: String, required: true},
    '账号': { type: String, initial: true},
    '密码': { type: String, initial: true},
    '描述': { type: String, initial: true}
});

Wxacc.defaultColumns = '名称, 账号, 描述';

Wxacc.register();