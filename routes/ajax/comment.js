var keystone = require('keystone');
var Comment = keystone.list('PostComment')

exports = module.exports = function(req, res) {
    var id = req.query.id;
    var page = (req.query.p)?req.query.p:1;
    var number = (req.query.n)?req.query.n:10;

    Comment.model.find().where('文章', id).populate('作者', 'username').sort('-时间').skip((page-1)*number).limit(number).exec(function(err, results) {
        res.json(results);
    });
}