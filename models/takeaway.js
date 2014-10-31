var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Takeaway = new keystone.List('Takeaway', {
    label: '外卖',
    singular: '外卖',
    plural: '外卖',
    map: { name: '店名' }
});

Takeaway.add({
    '店名': { type: String, required: true},
    '送餐时间': { type: Date, default: Date.now },
    '地址': String,
    '电话': String,
    '描述': String
});

Takeaway.defaultColumns = '店名, 电话, 描述';

Takeaway.register();