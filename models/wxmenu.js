var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Wxmenu = new keystone.List('Wxmenu', {
    label: '微信菜单',
    singular: '微信菜单',
    plural: '微信菜单',
    map: { name: '名称' }
});

Wxmenu.add({
    '名称': { type: String, required: true},
    '微信号': { type: Types.Relationship, ref: 'Wxacc', many: true, initial: true},
    '链接': { type: String, initial: true},
    '描述': { type: String, initial: true}
});

Wxmenu.defaultColumns = '名称, 微信号, 链接, 描述';

Wxmenu.register();