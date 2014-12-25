var keystone = require('keystone');
var hash = require('../../lib/utils').hash;

exports = module.exports = function(req, res) {
    var code = req.query.c;
    //console.log(code);
    //0 用户名密码不能为空
    if (code==null||code=="") {
        res.end("0");
        return;
    }

    var data = code.split(".",2);
    if (data[0]==null||data[0]==""||data[1]==null||data[1]=="") {
        res.end("0");
        return;
    }
    var key = "TheBund2014";

    var phone = decrypt(data[0], key);
    var password = decrypt(data[1], key);
    //console.log(email);
    //console.log(password);
    var doSignin = function(user) {
        user['lastlogintime'] = new Date();
        user._.password.compare(password, function(err, isMatch) {
            if (!err && isMatch) {
                user['loginerrortimes'] = 0;
                //console.log("uname:"+user.username);
                //console.log("email:"+user.email);
                //console.log("password:"+user.password);
                user.save(function(err) {
                    if (err) {
                        //console.log("error1:"+err);
                        return;
                    }
                    var userToken = user.id + hash(user.password);
                    var userinfo = {};
                    userinfo['username'] = user['username'];
                    userinfo['name'] = user['name'];
                    userinfo['userToken'] = userToken;
                    res.json(userinfo);
                    return;
                });
            } else {
                user['loginerrortimes']++;
                user.save(function(err) {
                    if (err) {
                        //console.log("error2:"+err);
                        return;
                    }
                    res.end("2");//2 密码错误，请重试，3次失败将锁定5分钟。
                    return;
                });
            }
        });
    };

    keystone.list('User').model.findOne({ phoneno: phone }).exec(function(err, user) {
        if (user) {
            if (user['loginerrortimes'] > 2) {
                var lastTime = user['lastlogintime'];
                if (lastTime==null) {
                    doSignin(user);
                    return;
                }
                var timeDiff = (new Date()) - lastTime;
                var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
                if (diffMins < 5) {
                    res.end("1");//1 连续3次密码错误，请等待5分钟
                    return;
                } else {
                    user['loginerrortimes'] = 0;
                    doSignin(user);
                    return;
                }
            } else {
                doSignin(user);
            }
            //user._.password.compare(password, function(err, isMatch) {
            //    if (!err && isMatch) {
            //        doSignin(user);
            //    }
            //    else {
            //        onFail(err);
            //    }
            //});
        } else {
            res.end("0");
        }
    });

    //var onSuccess = function() {
    //    var random = getRandom(100000,999999);
    //    var time = new Date().getTime();
    //    var sign = random.toString() + time.toString();
    //    console.log(random);
    //    console.log(time);
    //    console.log(sign);
    //    res.end(sign);
    //    return;
    //}
    //
    //var onFail = function() {
    //    res.end("0");
    //    return;
    //}
    //
    //keystone.session.signin({ email: email, password: password }, req, res, onSuccess, onFail);
}

function decrypt(s,pw){
    var myString='';
    var a=0;
    var pwLen=pw.length;
    var textLen=s.length;
    var i=0;
    var myHolder="";
    while(i<s.length-2)
    {
        myHolder=s.charAt(i)+s.charAt(i+1)+s.charAt(i+2);
        if (s.charAt(i)=='0') {
            myHolder=s.charAt(i+1)+s.charAt(i+2);
        }
        if ((s.charAt(i)=='0')&&(s.charAt(i+1)=='0')) {
            myHolder=s.charAt(i+2);
        }
        a=parseInt(myHolder);
        a=a^(pw.charCodeAt(i/3%pwLen));
        myString+=String.fromCharCode(a);
        i+=3;
    }//end of while i
    return myString;
}

function getRandom (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}
