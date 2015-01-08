var keystone = require('keystone'),
    Types = keystone.Field.Types;

var AppLaunch = new keystone.List('AppLaunch', {
    label: '手机开机',
    singular: '手机开机',
    plural: '手机开机',
    map: { name: '名称' }
});

AppLaunch.add({
    '名称': {type: String, required: true},
    '链接': { type: Types.Url},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url},
    '发布': { type: Boolean, initial: false }
});

AppLaunch.defaultColumns = '名称, 链接';

AppLaunch.register();