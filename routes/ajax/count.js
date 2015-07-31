var keystone = require('keystone');
var Count = keystone.list('Count');

exports = module.exports = function(req, res) {
    var name = req.query.name;
    if(!name)return;

    keystone.list('Count').model.findOne({ name: name }).exec(function(err, count) {
        if(count) {
            count.count++;
            count.save();
            res.end("ok");
        } else {
            var count = new Count.model({
                'name': name,
                'count': 1
            });
            count.save();
            res.end("ok");
        }
    });
}