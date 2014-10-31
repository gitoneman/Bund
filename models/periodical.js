var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Periodical = new keystone.List('Periodical', {
    label: '期刊',
    singular: '期刊',
    plural: '期刊',
    map: { name: '名称' }
});

Periodical.add({
    '名称': { type: String, required: true},
    '期数': { type: Types.Number},
    '发行时间': { type: Types.Date, default: Date.now},
    '封面图': { type: Types.CloudinaryImage, autoCleanup : true},
    '叠': { type: Types.Relationship, ref: 'Volume', many: true},
    '广告': { type: Types.Relationship, ref: 'AD', many: true}
});

Periodical.defaultColumns = '名称,期数, 发行时间, 叠';

Periodical.register();