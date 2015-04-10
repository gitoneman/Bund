var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var now = new Date();
    var q = keystone.list('CarouselApp').model.find().where('生效时间').lte(now).where('失效时间').gt(now).sort('-优先级').limit('10');
    q.exec(function(err, results) {
    	var q2 = keystone.list('CarouselAdApp').model.find().where('生效时间').lte(now).where('失效时间').gt(now).sort('锁定位置').limit('10');
	    q2.exec(function(err, results2) {
	    	for(var i=0;i<results2.length;++i) {
                var pos = results2[i]['锁定位置'];
                if (pos > 0) {
                	results.splice(pos-1, 0, results2[i]);
                }
            }
            res.json(results);
            next();
	    });
    });
}
