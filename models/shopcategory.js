var keystone = require('keystone'),
    Types = keystone.Field.Types;
var getRandom = require('../lib/utils').getRandom;

var ShopCategory = new keystone.List('ShopCategory', {
    label: '小店类别',
    singular: '小店类别',
    plural: '小店类别',
    map: { name: '名称' }
});

ShopCategory.add({
    '名称': { type: String, required: true, unique: true},
    '标识': { type: String, required: true, unique: true, initial: true},
    '描述': String
});

ShopCategory.defaultColumns = '名称, 标识, 描述';

ShopCategory.register();
