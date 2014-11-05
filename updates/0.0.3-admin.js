var keystone = require('keystone'),
    User = keystone.list('User'),
    Wxacc = keystone.list('Wxacc');

exports = module.exports = function(done) {

    new User.model({
        'username': 'adminuser',
        'email': 'yinz@me.com',
        'password': 'admin',
        'canAccessKeystone': true
    }).save(done);

    new Wxacc.model({
        '名称': '外滩主号',
        '账号': 'the-bund',
        '密码': 'thebundnewmedia'
    }).save(done);

    new Wxacc.model({
        '名称': '外滩教育',
        '账号': 'TBEducation@qq.com',
        '密码': '100108blds'
    }).save(done);

    new Wxacc.model({
        '名称': '外滩时尚',
        '账号': 'thebundstyle@163.com',
        '密码': 'bundstyle0708'
    }).save(done);

    new Wxacc.model({
        '名称': '时装辞典',
        '账号': 'fashiondict@163.com',
        '密码': '111111'
    }).save(done);

    new Wxacc.model({
        '名称': '设计酒店',
        '账号': '1276211271',
        '密码': '2013@zgzjsjjd'
    }).save(done);

    new Wxacc.model({
        '名称': '电影手册',
        '账号': 'bundfilm',
        '密码': '111111'
    }).save(done);

};