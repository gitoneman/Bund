var spider = require('./spider');
//
//
////TODO:文章分类抓取，文章作者
//
//
// this = {params:{ year: '2014', month: '09', n: '56261' },splats: [],route: '/:year/:month/:n.shtml',spider:{urls:[as a stack]},response:{headers:{},body:''},
// url:{host: 'www.bundpic.com',port: null,pathname: '/2014/09/56261.shtml',path: '/2014/09/56261.shtml',href: 'http://www.bundpic.com/2014/09/56261.shtml'}}

var count = 0;

module.exports = function() {
    spider()
        .route('www.bundpic.com', '/:year/:month/:n.shtml', function (window, $) {
            if (this.fromCache) return;
            console.log("Fetching page: " + this.spider.currentUrl);
            console.log(++count);
            $('div.cc p.date').each(function () {
                console.log("period=" + this.innerHTML);
            })
            $('div.cc h1').each(function () {
                console.log("title=" + this.childNodes[1].__nodeValue);
            })
            $('div.cc p.cinfo').each(function () {
                console.log("sub_title=" + this.innerHTML);
            })
            $('div.cc div.ccontent').each(function () {
                console.log("content=" + this.innerHTML);
            })
        })
        .route('www.bundpic.com', '/link_list.php*', function (window, $) {
            if (this.fromCache) return;
            console.log("Fetching page: " + this.spider.currentUrl);
            $('div.txt h3 a').spider();
            $('div.page ul li a').spider();
        })
        .route('www.bundpic.com', '/*.php', function (window, $) {
            if (this.fromCache) return;
            console.log("Fetching page: " + this.spider.currentUrl);
            $('div.nav2 div a').spider();
        })
        .route('www.bundpic.com', '/', function (window, $) {
            if (this.fromCache) return;
            console.log("Fetching page: " + this.spider.currentUrl);
            $('div.nav ul li a').spider();
        })
        .log('info')
        .get('http://www.bundpic.com/');
}
