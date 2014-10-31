var _ = require('underscore'),
    keystone = require('keystone');
 
/**
    Initialises the standard view locals.
    Include anything that should be initialised before route controllers are executed.
*/
exports.initLocals = function(req, res, next) {
    
    var locals = res.locals;

    locals.navLinks = [
        { label: '新 闻',		key: 'news',		href: '/posts/news' },
        { label: '生 活',		key: 'life',		href: '/posts/life' },
        { label: '时 尚',		key: 'style',		href: '/posts/style' },
        { label: '文 化',		key: 'members',		href: '/posts/culture' }
    ];

    locals.user = req.user;

    locals.basedir = keystone.get('basedir');

    locals.page = {
        title: '外滩Daily',
        path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
    };
    
    // Add your own local variables here
    
    next();
    
};
 
/**
    Inits the error handler functions into `req`
*/
exports.initErrorHandlers = function(req, res, next) {
    
    res.err = function(err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    }
    
    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message
        });
    }
    
    next();
    
};
 
/**
    Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function(req, res, next) {
    
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };
    
    res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
    
    next();
    
};

/**
 Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

    if (!req.user) {
        req.flash('error', '请您先登录.');
        res.redirect('/signin');
    } else {
        next();
    }

}