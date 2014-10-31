var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Post Comments Model
 * ===================
 */

var PostComment = new keystone.List('PostComment', {
    label: '评论',
    singular: '评论',
    plural: '评论',
    nocreate: true
});

PostComment.add({
    '文章': { type: Types.Relationship, ref: 'Post', index: true },
    '作者': { type: Types.Relationship, ref: 'User', index: true },
    '时间': { type: Types.Date, default: Date.now, index: true },
    '内容': { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

PostComment.defaultColumns = '内容, 文章, 作者, 时间';
PostComment.register();
