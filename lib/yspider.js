var util = require('util');
var events = require('events');
var fs = require('fs');
var path = require('path');
var cookiejar = require('cookiejar');
var routes = require('routes');
var request = require('request');
var urlParse = require('url').parse;
var urlResolve = require('url').resolve;
var jsdom = require('jsdom');

var jqueryFilename = path.join(__dirname, process.env.JQUERY_PATH || 'jquery.js');
var jquery = fs.readFileSync(jqueryFilename).toString();

var firefox = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) ' +
    'AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7';

//NOCache Class
function NoCache () {}
NoCache.prototype.get = function (url, cb) { cb(null) };
NoCache.prototype.getHeaders = function (url, cb) {cb(null)};
NoCache.prototype.set = function (url, headers, body) {};

//YStack Class : A timed queue for pop items.
function YStack (max_running, run) {
    this.run = run;
    this.torun = [];
    this.running = 0;
    this.runned = 0;
    this.max_running = max_running || 1;
    this.done = null;
    this.timer = null;
}
YStack.prototype.pop = function () {
    var self = this;
    if(this.torun.length>0&&this.running <= this.max_running) {
        this.running++;
        this.run(this.torun.pop(), function() {
            self.running--;
            self.runned++;
        });
    } else if (this.torun.length==0&&this.running==0) {
        clearInterval(self.timer);
        self.timer = null;
        if(typeof(self.done)=='function') {
            self.done();
        }
    }
};
YStack.prototype.push = function (item) {
    this.torun.push(item);
    var self = this;
    if(this.timer==null) {
        this.timer = setInterval(function(){
            self.pop();
        },200);
    }
};

function YSpider (options) {
    this.userAgent = options.userAgent || firefox;
    this.cache = options.cache || new NoCache();
    this.pool = options.pool || {maxSockets: 4};
    this.options = options;
    this.routers = {};
    this.urls = [];
    this.jar = cookiejar.CookieJar();
    var self = this;
    this.stack = new YStack(20, function(url, next) {
        var h = copy(headers);
        url = url.slice(0, (url.indexOf('#') === -1) ? url.length : url.indexOf('#'));
        if (self.urls.indexOf(url) !== -1) {
            // Already handled this request
            self.emit('log', 'debug', 'Already received one get request for '+url+'. skipping.');
            next();
            return;
        }
        self.urls.push(url);
        var u = urlParse(url);
        if (!self.routers[u.host]) {
            self.emit('log', 'debug', 'No routes for host: '+u.host+'. skipping.');
            next();
            return;
        }
        if (!self.routers[u.host].match(u.href.slice(u.href.indexOf(u.host)+u.host.length))) {
            self.emit('log', 'debug', 'No routes for path '+u.href.slice(u.href.indexOf(u.host)+u.host.length)+'. skipping.');
            next();
            return;
        }
        h['user-agent'] = self.userAgent;
        self.cache.getHeaders(url, function (c) {
            if (c) {
                if (c['last-modifed']) {
                    h['if-modified-since'] = c['last-modified'];
                }
                if (c.etag) {
                    h['if-none-match'] = c.etag;
                }
            }
            var cookies = self.jar.getCookies(cookiejar.CookieAccessInfo(u.host, u.pathname));
            if (cookies) {
                h.cookie = cookies.join(";");
            }
            request.get({url:url, headers:h, pool:self.pool},  function (e, resp, body) {
                if (e) {
                    self.emit('log', 'error', e);
                    next();
                    return;
                }
                if (resp.statusCode === 304) {
                    self.emit('log', 'debug', 'Response 304 for '+url+'.');
                    self.cache.get(url, function (c_) {
                        self._handler(url, {fromCache:true, headers:c_.headers, body:c_.body}, next);
                    });
                    return;
                } else if (resp.statusCode !== 200) {
                    self.emit('log', 'debug', 'Response '+resp.statusCode+' for '+url+'.');
                    next();
                    return;
                }
                if (resp.headers['set-cookie']) {
                    try { self.jar.setCookies(resp.headers['set-cookie']) }
                    catch(e) {}
                }
                self.emit('log', 'debug', 'Response 200 for '+url+'.');
                self.cache.set(url, resp.headers, body);
                self._handler(url, {fromCache:false, headers:resp.headers, body:body}, next);
            });
        });
    });
}
util.inherits(YSpider, events.EventEmitter);

var isUrl = /^https?:/;
YSpider.prototype.get = function (url) {
    this.base = url;
    this.stack.push(url);
};

YSpider.prototype.spider = function (url) {
    if (!isUrl.test(url)) {
        url = urlResolve(this.base, url);
    }
    this.stack.push(url);
};

YSpider.prototype.route = function (hosts, pattern, cb) {
    var self = this;
    if (typeof hosts === 'string') {
        hosts = [hosts];
    }
    hosts.forEach(function (host) {
        if (!self.routers[host]) self.routers[host] = new routes.Router();
        self.routers[host].addRoute(pattern, cb);
    })
    return self;
};

YSpider.prototype._handler = function (url, response, next) {
    if(response.headers['content-type'] && response.headers['content-type'].indexOf('javascript') != -1) {
        this._handler_js(url, response, next);
    } else if (response.headers['content-type'] && response.headers['content-type'].indexOf('html') != -1) {
        this._handler_html(url, response, next);
    } else {
        next();
    }
};

YSpider.prototype._handler_js = function (url, response, next) {
    var u = urlParse(url);
    if (this.routers[u.host]) {
        var r = this.routers[u.host].match(u.href.slice(u.href.indexOf(u.host)+u.host.length));
        r.spider = this;
        r.response = response;
        r.url = u;
        this.currentUrl = url;
        r.fn.call(r,  function() {
            next();
        });
        this.currentUrl = null;
    } else {
        next();
    }
};

jsdom.defaultDocumentFeatures = {
    FetchExternalResources   : [],
    ProcessExternalResources : false,
    MutationEvents           : false,
    QuerySelector            : false
}

YSpider.prototype._handler_html = function (url, response, next) {
    var u = urlParse(url);
    var self = this;
    if (this.routers[u.host]) {
        var r = this.routers[u.host].match(u.href.slice(u.href.indexOf(u.host)+u.host.length));
        r.spider = this;
        r.response = response;
        r.url = u;

        var document = jsdom.jsdom(response.body, null, {});
        var window = document.parentWindow;
        window.run(jquery, jqueryFilename);
        r.$ = window.$;
        this.currentUrl = url;
        if (jsdom.defaultDocumentFeatures.ProcessExternalResources) {
            $(function () { r.fn.call(r, function() {
                r.$ = null;
                window.close();
                next();
            }); })
        } else {
            r.fn.call(r, function() {
                r.$ = null;
                window.close();
//            r.$ = null;
                next();
            });
        }
        this.currentUrl = null;
    } else {
        next();
    }
};

var headers = {
    'accept': "application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5",
    'accept-language': 'en-US,en;q=0.8',
    'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
};

var copy = function (obj) {
    var n = {}
    for (i in obj) {
        n[i] = obj[i];
    }
    return n
};


var logLevels = {'close':0, 'debug':1, 'info':50, 'error':100};
YSpider.prototype.log = function (level) {
    if (typeof level === 'string') level = logLevels[level];
    if (this.loglevel==level) return;
    this.removeAllListeners('log');
    if (level>0) {
        this.on('log', function (l, text) {
            if (logLevels[l] >= level) {
                console.log('['+ l+']', text);
            }
        })
    }
    this.loglevel = level;
    return this;
};

module.exports = function (options) {return new YSpider(options || {});};