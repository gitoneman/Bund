var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Download = new keystone.List('Download', {
    label: '下载',
    singular: '下载',
    plural: '下载',
    map: { name: '事件' }
});

Download.add({
    '事件': { type: String, required: true, noedit: true},
    '时间': { type: Date, default: Date.now, noedit: true},
    'UA': { type: String, noedit: true},
    'IP': { type: String, noedit: true}

});

Download.defaultColumns = '项目, 创建时间,A, B, C, D, E, F, G, H, I';

Download.register();