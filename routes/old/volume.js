var keystone = require('keystone');
var Volume = keystone.list('Volume');

exports = module.exports = function(req, res) {
    Volume.model.findOne()
        .where('_id', req.params.id)
        .populate('文章')
        .exec(function(err, vol) {
            console.log(vol);
            if (err||!vol) {
                res.json({});
                return;
            }
            var volume = new Array();
            for(var i=0;i<vol['文章'].length;++i) {
                var post = vol['文章'][i];
                console.log(post);
                var p = {
                    "article_id":post.id,
                    "first_image":post['图片']?post['图片'].url:'',
                    "title":post['标题'],
                    "subheading":'',
                    "url":"www.bundpic.com/posts/post"+post.id,
                    "share_url":"www.bundpic.com/posts/post"+post.id,
                    "image":post['图片']?post['图片'].url:'',
                    "large_image":post['图片']?post['图片'].url:'',
                    "tags":'',
                    "introduction":post['正文']['简介'],
                    "has_small_image":'',
                    "category_id": post['分类']?post['分类'][0]:'',
                    "period": '',
                    "timeStamp": post._['发布时间']?post._['发布时间'].format['X']:'',
                    "ad_id": '',
                    "is_ad": ''
                };
                volume.push(p);
            }
            res.json(volume);
        });

}