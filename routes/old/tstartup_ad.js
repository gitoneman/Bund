//done
var keystone = require('keystone');
var AD = keystone.list('AD');
//var request = require("request")

exports = module.exports = function(req, res) {
//    var version = req.param('version').toLowerCase().trim();
    var platform = req.param('platform').toLowerCase().trim();
    var device = req.param('device').toLowerCase().trim();
    var position;
//    var url = "http://api.mediapad.cn/ads.php?ads_position=531";
    if(platform == 'ios' && (device.substring(0,7) == 'iphone3' || device.substring(0,7) == 'iphone4' || device.substring(0,5) == 'ipod3'  || device.substring(0,5) == 'ipod4')){
//        url = "http://api.mediapad.cn/ads.php?ads_position=531";
        position = "iphone4启动";
    }else if(platform == 'ios' && (device.substring(0,7) == 'iphone5' || device.substring(0,5) == 'ipod5' || substr($device, 0,7) == 'iphone6') ){
//        url = "http://api.mediapad.cn/ads.php?ads_position=532";
        position = "iphone5启动";
        //安卓
    }else if(platform == 'android'){
//        url = "http://api.mediapad.cn/ads.php?ads_position=533";
        position = "android启动";
    } else {
        position = "iphone4启动";
    }
//    console.log(url);
    AD.model.findOne()
        .where('广告位', position)
        .exec(function(err, ad) {
            var temp;
            if (err||!ad) {
                temp = {'ad_title':'启动广告',
                    'hideADView':'YES',
                    'displayTime':'2',
                    'id':'1',
                    'img':''
                };

            } else {
                temp = {'ad_title':'启动广告',
                    'hideADView':'NO',
                    'displayTime':ad['显示时长'],
                    'id':'',
                    'img':(ad['竖图'].url?ad['竖图'].url:'')
                };
            }
//            console.log(JSON.stringify(temp));
            res.json(temp);
//            JSON.parse(data.toString("utf8"));
//            res.end(JSON.stringify(temp));
//            res.end('{"ad_title":"\u542f\u52a8\u5e7f\u544a","hideADView":"YES","displayTime":"2","id":"1","img":""}');
        });

}