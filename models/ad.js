var keystone = require('keystone'),
    Types = keystone.Field.Types;

var AD = new keystone.List('AD', {
    label: '广告',
    singular: '广告',
    plural: '广告',
    map: { name: '广告名' }
});

AD.add({
    '广告名': { type: String, required: true},
    '广告位': { type: Types.Select, options: '未发布, iphone4启动, iphone5启动, android启动', default: '未发布' },
    '发布时间': { type: Types.Datetime, default: Date.now},
    '显示时长': { type: Types.Number, default:8},
    '横图': { type: Types.CloudinaryImage, autoCleanup : true},
    '横屏': { type: Types.Html, wysiwyg: true, height: 300 },
    '竖图': { type: Types.CloudinaryImage, autoCleanup : true},
    '竖屏': { type: Types.Html, wysiwyg: true, height: 300 },
    '统计链接': { type: Types.Url},
    '观看次数': { type: Types.Number, default:0, noedit: true},
    '点击次数': { type: Types.Number, default:0, noedit: true}
});

AD.defaultColumns = '广告名, 广告位, 观看次数, 点击次数';

AD.schema.pre('save', function(next) {
    if(this.isModified('横图')&&this.横图.url) {
        this.横屏="<p><img src='"+this.横图.url+"' width=320 height=480 _mce_src='"+this.横图.url+"'/></p>";
    }
    if(this.isModified('竖图')&&this.竖图.url) {
        this.竖屏="<p><img src='"+this.竖图.url+"' width=320 height=480 _mce_src='"+this.竖图.url+"'/></p>";
    }
    next();
});

AD.register();