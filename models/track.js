var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Track = new keystone.List('Track', {
    label: '跟踪',
    singular: '跟踪',
    plural: '跟踪',
    map: { name: '标题' },
    defaultSort: '-创建时间'
});

Track.add({
    '标题': { type: String, required: true, initial: true},
    '类型': { type: Types.Select, options: '新需求, 改进, bug, 技术支持, 加班费申请', default: '新需求'},
    '优先级': { type: Types.Select, options: '一般, 紧急, 重要, 次要, 无关紧要', default: '一般'},
    '状态': { type: Types.Select, options: '未处理, 正在处理, 处理完成, 已验收, 重新打开, 已关闭', default: '未处理' },
    '验收人': { type: Types.Relationship, ref: 'User', index: true, initial: true},
    '负责人': { type: Types.Relationship, ref: 'User', many: true, index: true, initial: true},
    '创建时间': { type: Date, default: Date.now, noedit: true },
    '预估时间': { type: String, initial: true},
    '开始时间': { type: Date},
    '完成时间': { type: Date},
    '标签': { type: String, initial: true},
    '原始描述': { type: Types.Html, wysiwyg: true, height: 150, initial: true },
    '追加描述': { type: Types.Html, wysiwyg: true, height: 150}
});

Track.defaultColumns = '标题|15%, 类型, 优先级, 状态, 验收人, 负责人, 创建时间, 开始时间, 预估时间, 完成时间';

Track.register();