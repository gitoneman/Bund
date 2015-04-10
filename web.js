// Load .env for development environments
require('dotenv').load();
var keystone = require('keystone');

keystone.init({
    'brand': '外滩后台',
    'name': '外滩后台',
    'port': '80',
    'favicon': 'public/favicon.ico',
    'less': 'public',
    'static': 'public',
    'static options': { maxAge: 86400000 },

    'views': 'templates/views',
    'view engine': 'jade',
    'view cache': true,

    'emails': 'templates/emails',

    'auto update': true,
    'mongo': process.env.MONGO_URI || 'mongodb://localhost:28933/bund',

    'session': true,
    'session store': 'mongo',
//    'session store': 'connect-mongostore',
//    'session store options': {
//        'collection': 'app_sessions',
//        "db": {
//            "name": "bund",
//            "servers": [
//                { "host": 'localhost', "port": '28933' }
//            ]
//        }
//    },
    'auth': true,
    'user model': 'User',
    'cookie secret': process.env.SECRET_KEY,

    'mandrill api key': 'CW_UE0jGRJjbkpUm9q3bCg',
    'cloudinary config': { cloud_name: 'dgam4av9h', api_key: '128144186336116', api_secret: 'BTdqh8AOr0w3pSWq66vR0jwTkPg' },

    //Option from: http://www.tinymce.com/wiki.php/Controls
    'wysiwyg override toolbar': false,
    'wysiwyg menubar': false,
    'wysiwyg skin': 'lightgray',
    'wysiwyg additional buttons': 'forecolor backcolor formatselect blockquote fontselect fontsizeselect removeformat media preview',
    'wysiwyg additional plugins': 'textcolor, media, preview',
    //'wysiwyg additional options': { cleanup: false },
    //'wysiwyg cloudinary images': true,
    'wysiwyg images': true,
//    'wysiwyg additional buttons': 'searchreplace visualchars,'
//        + ' charmap pagebreak paste, forecolor backcolor,'
//        +' emoticons media, preview print ',
//    'wysiwyg additional plugins': 'table, advlist, anchor,'
//        + ' autolink, autosave, bbcode, charmap, contextmenu, '
//        + ' directionality, emoticons, fullscreen, hr, media, pagebreak,'
//        + ' paste, preview, print, searchreplace, textcolor,'
//        + ' visualblocks, visualchars',
//    'wysiwyg additional buttons': 'fontselect fontsizeselect, forecolor backcolor, visualchars media preview',
//    'wysiwyg additional plugins': 'table, textcolor, visualchars, media, preview, fullpage',

//    'wysiwyg additional buttons': 'fontselect fontsizeselect searchreplace visualchars, charmap ltr rtl pagebreak paste, forecolor backcolor, emoticons media, preview print ',
//    'wysiwyg additional plugins': 'example, table, advlist, anchor, autolink, autosave, bbcode, charmap, contextmenu, directionality, emoticons, fullpage, hr, media, pagebreak, paste, preview, print, searchreplace, textcolor, visualblocks, visualchars, wordcount',

    'basedir': __dirname,
    'logger': 'tiny'
});

keystone.set('locals', {
    utils: keystone.utils
});

keystone.set('email locals', {
    utils: keystone.utils,
    host: (function() {
        if (keystone.get('env') === 'staging') return 'http://localhost';
        if (keystone.get('env') === 'production') return 'http://www.bundpic.com';
        return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
    })()
});

keystone.set('cloudinary folders', true);

//keystone.set('s3 config', { bucket: 'bundtest', key: 'AKIAIKCBVRCVBMACKZEQ', secret: '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' });

//keystone.set('cloudinary config', { cloud_name: 'dkty0gd0l', api_key: '734878845222848', api_secret: 'Ol2YrUrp-utNnFHQ2oCIVsJm0aY' });
//keystone.set('wysiwyg images', true);

keystone.import('models');

keystone.set('routes', require('./routes'));
keystone.set('nav', {
    '用户': 'User',
    '网站': ['Post', 'PostComment', 'Carousel','CarouselApp', 'CarouselAdApp', 'Picture', 'PostCategory', 'Distribution', 'Periodical', 'Volume'],
    '广告': 'AD',
    '微信': ['Wxacc', 'Wxreply', 'Wxmenu'],
    '项目': ['Track'],
    '其他': ['Feedback', 'Takeaway']
});

keystone.start();
