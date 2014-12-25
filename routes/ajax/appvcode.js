var keystone = require('keystone');
var https = require('https');
var querystring = require('querystring');
var async = require('async');
var User = keystone.list('User').model;

exports = module.exports = function(req, res) {

    var phoneno = req.query.no;

    if (phoneno == null || phoneno == "") {
        return res.end('1'); //1 手机号不能不填
    }
    var now = new Date();
    var vcode = getRandom(100000,999999);

    async.series([
        function(cb) {
            User.findOne({ phoneno: phoneno }).exec(function(err, user) {
                if (user) {
                    if (user['password']) {
                        return cb('2'); //2 此手机号已被注册
                    }
                    if(user['lastvcodetime']!=null) {
                        var timeDiff = now - user['lastvcodetime'];
                        var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
                        if (diffMins < 1) {
                            return cb('5'); //1分钟以后再请求
                        }
                    }
                    user['vcode'] = vcode;
                    user['lastvcodetime'] = now;
                    return cb();
                } else {
                    var userData = {
                        username: phoneno,
                        phoneno: phoneno,
                        vcode: vcode,
                        lastvcodetime: now
                    };

                    var newUser = new User(userData);
                    newUser.save(function(err) {
                        if (err) {
                            return cb('3'); //3，新建手机用户失败。
                        }
                        return cb();
                    });
                }
            });
        },
        function(cb) {
            var postData = {
                mobile:phoneno,
                message: vcode+'，请勿泄露此验证码。输入验证码注册帐号，时髦生活上外滩~【外滩】'
            };

            var content = querystring.stringify(postData);

            var options = {
                host:'sms-api.luosimao.com',
                path:'/v1/send.json',
                method:'POST',
                auth:'api:key-378a9f86d559e6e373cb59b2986554a4',
                agent:false,
                rejectUnauthorized : false,
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length' :content.length
                }
            };

            var sreq = https.request(options,function(sres){
                sres.setEncoding('utf8');
                sres.on('data', function (chunk) {
                    var result = JSON.parse(chunk);
                    if (result.error == '0') {
                        return res.end('0');
                    } else {
                        return cb('4'); //4, 短信发送失败。
                    }
                });
            });
            sreq.write(content);
            sreq.end();
        }
    ], function(err) {
        res.end(err);
    });

}

function getRandom (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}