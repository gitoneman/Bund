var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Feedback = new keystone.List('Feedback', {
    label: '反馈',
    singular: '反馈',
    plural: '反馈',
    map: { name: '反馈' }
});

Feedback.add({
    '反馈': { type: String, required: true},
    '描述': { type: Types.Html, wysiwyg: true, height: 150, initial: true }
});

Feedback.defaultColumns = '反馈, 描述';

Feedback.register();