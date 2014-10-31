var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.on('post', { action: 'forgot-password' }, function(next) {
		
		if (!req.body.email) {
			req.flash('error', "请输入一个邮箱账号.");
			return next();
		}

		User.model.findOne().where('email', req.body.email).exec(function(err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "此邮箱没有注册过.");
				return next();
			}
			user.resetPassword(function(err) {
				// if (err) return next(err);
				if (err) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					req.flash('error', '重设密码邮件发送失败，请联系我们。');
					next();
				} else {
					req.flash('success', '我们已经成功发送了重置密码链接到您的邮箱，请前往邮箱操作。');
					res.redirect('/signin');
				}
			});
		});
		
	});
	
	view.render('session/forgot-password');
	
}
