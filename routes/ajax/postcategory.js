var keystone = require('keystone');
var Post = keystone.list('Post')

exports = module.exports = function(req, res) {
    var id = req.query.id;

    Post.model.findOne()
        .where('_id', id)
        .select('分类')
        .populate('分类')
        //.populateRelated('分类')
        .exec(function(err, post) {
            if (err) {
                res.end("1"); //没有此文章
            }
            if (post) {
                //console.log(post);
                res.json(post['分类']);
            } else {
                res.end("1"); //没有此文章
            }
        });

}
