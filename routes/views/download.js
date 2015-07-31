var keystone = require('keystone');

exports = module.exports = function(req, res) {
    var from = req.params.post;
    var ua = req.headers['user-agent'];
    console.log(ua);
    if (/iPhone|iPad|iPod/i.test(ua)) {
        return res.redirect('https://itunes.apple.com/us/app/wai-tan-shi-mao-sheng-huo/id957420282');
    }
    if (/Android/.test(ua)) {
        return res.redirect('http://www.wandoujia.com/apps/com.tbund.bundroidapp');
    }

    return res.sendfile(keystone.get('basedir') + '/public/app/download.html');

    //return res.redirect('http://www.landrover.com.cn/vehicles/range-rover-evoque/index.html');
}