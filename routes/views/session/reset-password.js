var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.on('init', function(next) {
		
		User.model.findOne().where('resetPasswordKey', req.params.key).exec(function(err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "对不起，重设密码的链接已经过期，请重新获取。");
				return res.redirect('/forgot-password');
			}
			locals.found = user;
			next();
		});
		
	});
	
	view.on('post', { action: 'reset-password' }, function(next) {
		
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', "请重复输入您的新密码");
			return next();
		}
		
		if (req.body.password != req.body.password_confirm) {
			req.flash('error', '两次输入的密码不一致。');
			return next();
		}
		
		locals.found.password = req.body.password;
		locals.found.resetPasswordKey = '';
		locals.found.save(function(err) {
			if (err) return next(err);
			req.flash('success', '您的密码已重设成功，请登录。');
			res.redirect('/signin');
		});
		
	});
	
	view.render('session/reset-password');
	
}
