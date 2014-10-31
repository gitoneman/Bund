var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Post Comments Model
 * ===================
 */

var ThumbUp = new keystone.List('ThumbUp', {
    label: '赞',
    singular: '赞',
    plural: '赞',
    nocreate: true
});

ThumbUp.add({
    '文章': { type: Types.Relationship, ref: 'Post', index: true },
    '作者': { type: Types.Relationship, ref: 'User', index: true }
});


/**
 * Registration
 * ============
 */

ThumbUp.defaultColumns = '文章, 作者';
ThumbUp.register();
