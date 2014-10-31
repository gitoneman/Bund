var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	locals.form = req.body;
	
	view.on('post', { action: 'signin' }, function(next) {

		if (!req.body.email || !req.body.password) {
			req.flash('error', '请输入您的邮箱和密码');
			return next();
		}

		var onSuccess = function() {
			if (req.body.target && !/join|signin/.test(req.body.target)) {
				console.log('[signin] - Set target as [' + req.body.target + '].');
				res.redirect(req.body.target);
			} else {
				res.redirect('/me');
			}
		}

		var onFail = function() {
			req.flash('error', '用户名或密码错误，请重试。');
			return next();
		}

		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

	});
	
	view.render('session/signin');
	
}
