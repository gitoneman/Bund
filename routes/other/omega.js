var keystone = require('keystone');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res);

//    view.on('post', function(next) {
//        var CollectData = {
//            '项目': '路虎2014',
//            '姓名': req.body.name,
//            '性别': req.body.gender,
//            '电话': req.body.phone,
//            '邮箱': req.body.email,
//            '省': req.body.province,
//            '市': req.body.city,
//            '车型': req.body.type,
//            '购车时间': req.body.time,
//            '预算': req.body.budget
//        };
//        var Collect = keystone.list('Collect').model,
//            newCollect = new Collect(CollectData);
//        newCollect.save(function(err) {
//            return res.redirect('http://www.landrover.com.cn/vehicles/range-rover-evoque/index.html');
//        });
//    });

    view.render('other/omega');
}