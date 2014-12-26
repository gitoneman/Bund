var keystone = require('keystone');
var User = keystone.list('User').model;
//var hash = require('../../lib/utils').hash;
var decrypt = require('../../lib/utils').decrypt;

exports = module.exports = function(req, res) {

    var phoneno = req.query.no;
    var vcode = req.query.vcode;
    var pwd = req.query.pwd;

    if (phoneno==null||phoneno==""||vcode==null||vcode==""||pwd==null||pwd=="") {
        return res.end("1"); //1 输入信息不完整
    }
    User.findOne({ phoneno: phoneno }).exec(function(err, user) {
        if (user) {
            if (user['vcode'] != vcode) {
                return res.end('2'); //2 验证码不正确
            }
            var password = decrypt(pwd);
            user['password'] = password;
            user.save(function(err) {
                if(err) {
                    return res.end('3'); //3 服务器处理失败
                }
                return res.end('0'); //0 修改成功
            });
        } else {
            return res.end('4'); //4 此手机号还未注册
        }
    });

}
