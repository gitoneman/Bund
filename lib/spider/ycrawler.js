var request = require('request');
var util = require('util');
var events = require('events');
var fs = require('fs');
var path = require('path');
var urlParse = require('url').parse;
var urlResolve = require('url').resolve;
var routes = require('routes');
var cookiejar = require('cookiejar');
var jsdom = require('jsdom');

var jqueryFilename = path.join(__dirname, '../../public/js/lib/jquery/1.11.1.min.js');
//var jqueryFilename = path.join(__dirname, 'jquery.js');
var jquery = fs.readFileSync(jqueryFilename).toString();

var firefox = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) ' +
    'AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7';

function NoCache () {}
NoCache.prototype.get = function (url, cb) { cb(null) };
NoCache.prototype.getHeaders = function (url, cb) {cb(null)};
NoCache.prototype.set = function (url, headers, body) {};

function YStack (run, max_running) {
    this.run = run;
    this.torun = [];
    this.running = 0;
    this.runned = 0;
    this.max_running = max_running || 1;
}
YStack.prototype.pop = function () {
    var self = this;
//    console.log("running:"+this.running+',torun:'+this.torun.length+',runned:'+this.runned);
    if(this.torun.length>0&&this.running <= this.max_running) {
        this.running++;
        this.run(this.torun.pop(), function() {
            self.running--;
            self.runned++;
            self.pop();
        });
    }
};
YStack.prototype.push = function (item) {
    this.torun.push(item);
    this.pop();
};

function Ycrawler (options) {
    var self = this;
    this.userAgent = options.userAgent || firefox;
    this.cache = options.cache || new NoCache();
    this.pool = options.pool || {maxSockets: 4};
    this.options = options;
    this.routers = {};
    this.urls = [];
    this.jar = cookiejar.CookieJar();
    this.max_saving = options.max_saving || 2;
    this.max_fetching = options.max_fetching || 20;
    this.to_be_get = [];
    this.saving = 0;
    this.fetching = 0;
    this.saved = 0;
    this.currentUrl = null;
    this.stack = new YStack(function(url, done) {
        var h = copy(headers);
        url = url.slice(0, (url.indexOf('#') === -1) ? url.length : url.indexOf('#'));
        if (self.urls.indexOf(url) !== -1) {
            // Already handled this request
            self.emit('log', 'debug', 'Already received one get request for '+url+'. skipping.');
            done();
            return;
        }
        self.urls.push(url);

        var u = urlParse(url);
        if (!self.routers[u.host]) {
            self.emit('log', 'debug', 'No routes for host: '+u.host+'. skipping.');
            done();
            return;
        }

        if (!self.routers[u.host].match(u.href.slice(u.href.indexOf(u.host)+u.host.length))) {
            self.emit('log', 'debug', 'No routes for path '+u.href.slice(u.href.indexOf(u.host)+u.host.length)+'. skipping.');
            done();
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
                self.emit('log', 'debug', 'Response received for '+url+'.');
                if (e) {
                    self.emit('log', 'error', e);
                    done();
                    return;
                }
                if (resp.statusCode === 304) {
                    self.cache.get(url, function (c_) {
                        self._handler(url, {fromCache:true, headers:c_.headers, body:c_.body}, done);
                    });
                    return;
                } else if (resp.statusCode !== 200) {
                    self.emit('log', 'debug', 'Request did not return 200. '+url);
                    done();
                    return;
                } else if (!resp.headers['content-type'] || resp.headers['content-type'].indexOf('html') === -1) {
                    self.emit('log', 'debug', 'Content-Type does not match. '+url);
                    done();
                    return;
                }
                if (resp.headers['set-cookie']) {
                    try { self.jar.setCookies(resp.headers['set-cookie']) }
                    catch(e) {}
                }
                self.cache.set(url, resp.headers, body);
                self._handler(url, {fromCache:false, headers:resp.headers, body:body}, done);
            });
        });
        return;
    }, 20);
}
util.inherits(Ycrawler, events.EventEmitter);

var headers = {
    'accept': "application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5",
    'accept-language': 'en-US,en;q=0.8',
    'accept-charset':  'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
}

var copy = function (obj) {
    var n = {}
    for (i in obj) {
        n[i] = obj[i];
    }
    return n
}

Ycrawler.prototype.get = function (url, done) {
    this.stack.push(url);
//    this.to_be_get.push(url);
//    this.fetch(done);
}

//Ycrawler.prototype.fetch = function (done) {
//    this.emit('log', 'debug', '=========================================================== ' + this.saving+'/'+ this.fetching+'/'+this.to_be_get.length+'/'+this.saved);
//    if(this.fetching>=this.max_fetching||this.to_be_get.length==0) return;
//    this.fetching++;
//    var url = this.to_be_get.pop();
//    var self = this;
//    var h = copy(headers);
//    url = url.slice(0, (url.indexOf('#') === -1) ? url.length : url.indexOf('#'));
//
//    if (this.urls.indexOf(url) !== -1) {
//        // Already handled this request
//        this.emit('log', 'debug', 'Already received one get request for '+url+'. skipping.');
//        return this;
//    }
//    this.urls.push(url);
//
//    var u = urlParse(url);
//    if (!this.routers[u.host]) {
//        this.emit('log', 'debug', 'No routes for host: '+u.host+'. skipping.')
//        return this;
//    }
//
//    if (!this.routers[u.host].match(u.href.slice(u.href.indexOf(u.host)+u.host.length))) {
//        this.emit('log', 'debug', 'No routes for path '+u.href.slice(u.href.indexOf(u.host)+u.host.length)+'. skipping.')
//        return this;
//    }
//    h['user-agent'] = this.userAgent;
//
//    this.cache.getHeaders(url, function (c) {
//        if (c) {
//            if (c['last-modifed']) {
//                h['if-modified-since'] = c['last-modified'];
//            }
//            if (c.etag) {
//                h['if-none-match'] = c.etag;
//            }
//        }
//        var cookies = self.jar.getCookies(cookiejar.CookieAccessInfo(u.host, u.pathname));
//        if (cookies) {
//            h.cookie = cookies.join(";");
//        }
//        request.get({url:url, headers:h, pool:self.pool},  function (e, resp, body) {
//            self.emit('log', 'debug', 'Response received for '+url+'.');
//            if (e) {
//                self.emit('log', 'error', e);
//                return;
//            }
//            if (resp.statusCode === 304) {
//                self.cache.get(url, function (c_) {
//                    self._handler(url, {fromCache:true, headers:c_.headers, body:c_.body}, done);
//                });
//                return;
//            } else if (resp.statusCode !== 200) {
//                self.emit('log', 'debug', 'Request did not return 200. '+url);
//                return;
//            } else if (!resp.headers['content-type'] || resp.headers['content-type'].indexOf('html') === -1) {
//                self.emit('log', 'debug', 'Content-Type does not match. '+url);
//                return;
//            }
//            if (resp.headers['set-cookie']) {
//                try { self.jar.setCookies(resp.headers['set-cookie']) }
//                catch(e) {}
//            }
//            self.cache.set(url, resp.headers, body);
//            self._handler(url, {fromCache:false, headers:resp.headers, body:body}, done);
//        });
//
//    });
//    return this;
//}

Ycrawler.prototype.route = function (hosts, pattern, cb) {
    var self = this;
    if (typeof hosts === 'string') {
        hosts = [hosts];
    }
    hosts.forEach(function (host) {
        if (!self.routers[host]) self.routers[host] = new routes.Router();
        self.routers[host].addRoute(pattern, cb);
    })
    return self;
}

jsdom.defaultDocumentFeatures = {
    FetchExternalResources   : [],
    ProcessExternalResources : false,
    MutationEvents           : false,
    QuerySelector            : false
}

var isUrl = /^https?:/;
Ycrawler.prototype._handler = function (url, response, done) {
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

        window.$.fn.spider = function () {
            this.each(function () {
                var h = window.$(this).attr('href');
                if (!isUrl.test(h)) {
                    h = urlResolve(url, h);
                }
                self.stack.push(h);
//                self.to_be_get.push(h);
//                self.fetch(done);
//                self.get(h, null);
            })
        }
        this.currentUrl = url;
        if (jsdom.defaultDocumentFeatures.ProcessExternalResources) {
//            self.saving++;
            $(function () { r.fn.call(r, window, window.$, function() {
                window.close();
                done();
//                self.saving--;
//                self.fetching--;
//                self.saved++;
//                if(self.to_be_get.length==0&&self.saving==0) {
//                    done();
//                } else {
//                    self.fetch(done);
//                }
            }); })
        } else {
//            self.saving++;
            r.fn.call(r, window, window.$, function() {
                window.close();
                done();
//                self.saving--;
//                self.fetching--;
//                self.saved++;
//                if(self.to_be_get.length==0&&self.saving==0) {
//                    done();
//                } else {
//                    self.fetch(done);
//                }
            });
        }
        this.currentUrl = null;
    }
}

var logLevels = {'close':0, 'debug':1, 'info':50, 'error':100};
Ycrawler.prototype.log = function (level) {
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
}

module.exports = function (options) {return new Ycrawler(options || {})};
module.exports.YStack = YStack;