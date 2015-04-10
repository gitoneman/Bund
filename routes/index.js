var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);
var proxy = require('express-http-proxy');
 
// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
//keystone.pre('routes', middleware.loadSponsors);
keystone.pre('render', middleware.flashMessages);
 
// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});
 
// Handle other errors
keystone.set('500', function(err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});
 
// Load Routes
var routes = {
    views: importRoutes('./views'),
    wx: importRoutes('./wx'),
    ajax: importRoutes('./ajax'),
    old: importRoutes('./old'),
    other: importRoutes('./other'),
    rss: importRoutes('./rss')
};
 
// Bind Routes
exports = module.exports = function(app) {
    // Website
    app.get('/', routes.views.index);
    app.post('/searchresult', routes.views.search);
    app.get('/posts/:category?', routes.views.posts);
    app.all('/posts/post/:post', routes.views.post);
    app.get('/mpost/:post', routes.views.mpost);
    app.get('/mcarousel/:id', routes.views.mcarousel);
    app.get('/mcarouselad/:id', routes.views.mcarouselad);
    app.get('/mlaunchw/:id', routes.views.mlaunchw);
    app.get('/mlaunchn/:id', routes.views.mlaunchn);
    app.get('/app/phone', routes.views.download);

    // Session
    app.all('/join', routes.views.session.join);
    app.all('/signin', routes.views.session.signin);
    app.get('/signout', routes.views.session.signout);
    app.all('/forgot-password', routes.views.session['forgot-password']);
    app.all('/reset-password/:key', routes.views.session['reset-password']);

    // User
    app.all('/me*', middleware.requireUser);
    app.all('/me', routes.views.me);
//    app.all('/me/create/post', routes.views.createPost);
//    app.all('/me/create/link', routes.views.createLink);

    // Json
    app.get('/get-carousel', routes.ajax.carousel);
    app.get('/app-carousel', routes.ajax.carouselapp);
    app.post('/share', routes.ajax.share);
    app.get('/postpage', routes.ajax.postpage);
    app.get('/app-post', routes.ajax.postapp);
    app.get('/hots', routes.ajax.hots);
    app.get('/comment', routes.ajax.comment);
    app.get('/comment-count', routes.ajax.commentcount);
    app.get('/app-category', routes.ajax.appcategory);
    app.all('/search', routes.ajax.search);
    app.get('/app-vcode', routes.ajax.appvcode);
    app.get('/app-login', routes.ajax.applogin);
    app.post('/app-join', routes.ajax.appjoin);
    app.get('/app-resetpwd', routes.ajax.appresetpwd);
    app.post('/app-comment', routes.ajax.appcomment);
    app.get('/app-addfav', routes.ajax.appaddfav);
    app.get('/app-delfav', routes.ajax.appdelfav);
    app.get('/app-favlist', routes.ajax.appfavlist);
    app.get('/app-postcategory', routes.ajax.postcategory);
    app.get('/app-thumbup', routes.ajax.appthumbup);
    app.get('/app-launch', routes.ajax.applaunch);

    // Other
    app.post('/collect', routes.ajax.collect);
    app.get('/landrover', routes.other.landrover);
    //app.all('/omega', routes.other.omega);

    app.get('/wx', routes.wx.index);

    app.get('/rss/daily.xml', routes.rss.daily);

//    app.get('http://*', function(req, res) {
//        console.log('A get request not available');
//        res.json('false');
//    });
//    app.put('*', function(req, res) {
//        console.log('A put request not available');
//        res.json('false');
//    });
    // Authentication

    //Old Mobile Apps

//    app.all('/api_app_ios_300.php', routes.old.api_app_ios_300);
//
//    //老版启动广告 ok
//    app.post('/tstartup_ad.php', routes.old.tstartup_ad);
//
//    //ipad版用到参数为retina=1
//    app.get('/api_app_ios_130.php', routes.old.api_app_ios_130);
//    //
//    app.get('/ipad_xml.php', routes.old.ipad_xml);
//    //手机广告 ok
//    app.get('/ad/:id', routes.old.ad);
//    //广告点击统计 ok
//    app.get('/adlog/:id', routes.old.adlog);
//    //新版启动广告 ok
//    app.get('/startup_ad.php', routes.old.startup_ad);
//    app.get('/api_app_ios_ad_130.php', routes.old.api_app_ios_ad_130);
//    //ipad同步缓存，返回目录宝路径 ok
//    app.get('/api_app_ios_rsync.php', routes.old.api_app_ios_rsync);
//    //
//    app.get('/volume/:id', routes.old.volume)
    app.use(proxy(process.env.OLD_SERVER_IP));
//    app.all('*', routes.old.forward);
}