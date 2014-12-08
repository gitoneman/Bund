var keystone = require('keystone');

exports = module.exports = function(req, res) {
    var url = req.body.url?req.body.url:"http://www.bundpic.com"
    var project = req.body.project?req.body.project:"未知项目"
    var CollectData = {'项目':project};
    for (var i = 65; i <= 90; i++) {
        var c = String.fromCharCode(i);
        var p = eval("req.body."+c);
        console.log(c+":"+p);
        if (p!=null&&p!='') {
            CollectData[c] = p;
        }
    }
    console.log(CollectData);
    var Collect = keystone.list('Collect').model;
    var newCollect = new Collect(CollectData);
    newCollect.save(function(err) {
        console.log(err);
        return res.redirect(url);
    });
}
//http://www.landrover.com.cn/vehicles/range-rover-evoque/index.html