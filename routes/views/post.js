var keystone = require('keystone');
var Post = keystone.list('Post');
var PostComment = keystone.list('PostComment');
var ThumbUp = keystone.list('ThumbUp');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
//	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};

	view.on('init', function(next) {

		Post.model.findOne()
			.where('_id', locals.filters.post)
//            .populateRelated('评论')
			.exec(function(err, post) {
				if (err) return res.err(err);
				if (!post) return res.notfound('文章不存在');
				// Allow admins or the author to see draft posts
				if (post['状态'] == '已发布' || (req.user && req.user.canAccessKeystone) ) {
                    //统计
                    post['总点击数']++;
                    var today = new Date()
                    today.setHours(0,0,0,0);
                    if(post['最近点击日']==null||post['最近点击日']<today) {
                        post['最近点击日'] = today
                        post['当日点击数'] = 1;
                    } else {
                        post['当日点击数']++;
                    }
                    var thisweek = new Date();
                    thisweek.setHours(0,0,0,0);
                    var day = thisweek.getDay();
                    var diff = thisweek.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
                    thisweek.setDate(diff);
                    if(post['最近点击周']==null||post['最近点击周']<thisweek) {
                        post['最近点击周'] = thisweek;
                        post['当周点击数'] = 1;
                    } else {
                        post['当周点击数']++;
                    }
                    post.save(function(err) {
                        if (err) console.log(err);
                    });

					locals.post = post;
                    locals.page.title = post['标题'];
					locals.post.populateRelated('评论[作者]', next);
                } else {
					return res.notfound('文章不存在');
				}
			});
	});

    view.on('init', function(next) {
        if(locals.user) {
            keystone.list('ThumbUp').model.findOne({ '文章': locals.post.id, '作者': locals.user.id }, function(err, thumbup) {
                if (err || thumbup) {
                    locals.thumbup = false;
                } else {
                    locals.thumbup = true;
                }
                next();
            });
        } else {
            next();
        }
    });
	
	// Load recent posts
//	view.query('data.posts',
//		Post.model.find()
//			.where('state', 'published')
//			.sort('-publishedDate')
//			.populate('author')
//			.limit('4')
//	);
	
	view.on('post', { action: 'create-comment' }, function(next) {
        if(locals.user) {
            // handle form
            var newPostComment = new PostComment.model({
                '文章': locals.post.id,
                '作者': locals.user.id
            });
            var updater = newPostComment.getUpdateHandler(req, res, {
                errorMessage: '评论出了点问题，请重试。'
            });

            updater.process(req.body, {
                flashErrors: true,
                logErrors: true,
                fields: '内容'
            }, function(err) {
                if (err) {
                    locals.validationErrors = err.errors;
                } else {
                    req.flash('success', '您的评论已成功发表.');
                    return res.redirect('/posts/post/' + locals.post._id);
                }
                next();
	    	});
        } else {
            next();
        }

	});

    view.on('post', { action: 'thumb-up' }, function(next) {
        if(locals.user) {
            // handle form
            var newThumbUp = new ThumbUp.model({
                '文章': locals.post.id,
                '作者': locals.user.id
            });
            var updater = newThumbUp.getUpdateHandler(req, res, {
                errorMessage: '点赞失败，请重试。'
            });
            updater.process(req.body, {
                flashErrors: true,
                logErrors: true
            }, function(err) {
                if (err) {
                    locals.validationErrors = err.errors;
                } else {
                    req.flash('success', '点赞成功');
                    locals.post['赞数']++;
                    locals.post.save(function(err) {
                        if (err) return next(err);
//                        return;
                        next();
                    });
//                    req.flash('success', '您的修改已成功。');
//                    return;
                    return res.redirect('/posts/post/' + locals.post._id);
                }
                next();
            });
        } else {
            next();
        }
    });

    view.on('post', { action: 'thumb-down' }, function(next) {
        if(locals.user) {
            keystone.list('ThumbUp').model.findOne({ '文章': locals.post.id, '作者': locals.user.id }).exec(function (err, thumbup) {
                if (err || !thumbup) {
                    next();
                }
                thumbup.remove(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        locals.post['赞数']--;
                        locals.post.save(function(err) {
                            if (err) return next(err);
                            next();
                        });
                        return res.redirect('/posts/post/' + locals.post._id);
                    }
                });
            });
        } else {
            next();
        }
    });

	// Render the view
	view.render('site/post');

}
