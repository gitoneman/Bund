var keystone = require('keystone');
var User = keystone.list('User').model;
var hash = require('../../lib/utils').hash;
var decrypt = require('../../lib/utils').decrypt;

exports = module.exports = function(req, res) {

    var phoneno = req.query.no;
    var vcode = req.query.vcode;
    var uname = req.query.uname;
    var pwd = req.query.pwd;

    if (phoneno==null||phoneno==""||vcode==null||vcode==""||uname==null||uname==""||pwd==null||pwd=="") {
        return res.end("1"); //1 输入信息不完整
    }

    User.findOne({ phoneno: phoneno }).exec(function(err, user) {
        if (user) {
            if (user['password']) {
                return res.end('2'); //2 此手机号已被注册
            }
            if (user['vcode'] != vcode) {
                return res.end('3'); //验证码不正确
            }
            var password = decrypt(pwd, key);
            var now = new Date();
            var userData = {
                username: uname,
                password: password,
                phoneno: phoneno,
                createtime: now,
                lastlogintime: now
            };
            var newUser = new User(userData);
            newUser.save(function(err) {
                if(err) {
                    return res.end('4'); //4新建用户失败
                }

                var userToken = user.id + hash(user.password);
                var userinfo = {};
                userinfo['username'] = user['username'];
                //userinfo['name'] = user['name'];
                userinfo['userToken'] = userToken;
                res.json(userinfo);
                return;
            });
        }
    });

}
