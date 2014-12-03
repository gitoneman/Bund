var keystone = require('keystone');
var Comment = keystone.list('PostComment')

exports = module.exports = function(req, res) {
    var id = req.query.id;

    Comment.model.count().where('文章', id).exec(function(err, result) {
        res.json(result);
    });
}