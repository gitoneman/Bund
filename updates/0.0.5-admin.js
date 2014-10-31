var keystone = require('keystone'),
    PostCategory = keystone.list('PostCategory');

exports = module.exports = function(done) {
    new PostCategory.model({
        '名称': '新闻',
        '标识': 'news'
    }).save(done);

    new PostCategory.model({
        '名称': '生活',
        '标识': 'life'
    }).save(done);

    new PostCategory.model({
        '名称': '时尚',
        '标识': 'style'
    }).save(done);

    new PostCategory.model({
        '名称': '文化',
        '标识': 'culture'
    }).save(done);
}