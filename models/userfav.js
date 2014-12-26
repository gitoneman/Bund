var keystone = require('keystone'),
    Types = keystone.Field.Types;

var UserFav = new keystone.List('UserFav', {
    label: '用户收藏',
    singular: '用户收藏',
    plural: '用户收藏',
    nocreate: true
});


UserFav.add({
    '所有者': { type: Types.Relationship, ref: 'User', index: true },
    '文章列表': { type: Types.Relationship, ref: 'Post', many: true}
});


/**
 * Registration
 * ============
 */

UserFav.defaultColumns = '所有者, 文章列表';
UserFav.register();
