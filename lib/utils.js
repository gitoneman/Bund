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
