var crypto = require('crypto');
var keystone = require('keystone');

exports.hash = function(str) {
    // force type
    str = '' + str;
    // get the first half
    str = str.substr(0, Math.round(str.length / 2));
    // hash using sha256
    return crypto
        .createHmac('sha256', keystone.get('cookie secret'))
        .update(str)
        .digest('base64')
        .replace(/\=+$/, '');
};

exports.decrypt = function(s){
    var pw = "TheBund2014"
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
};

exports.getRandom = function(low, high) {
    return Math.round(Math.random() * (high - low) + low);
}
