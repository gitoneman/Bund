var keystone = require('keystone');
//var Req = require('../utils/req');

var Periodical = keystone.list('Periodical');


exports = module.exports = function(req, res) {
    var action = req.query.action;
    if(action == "ipad_news_list"){
        res.json({});
    } else {
//        // iPad 3.0版入口内容
//        var q = Periodical.model.find().sort('-发行时间').limit('8').populate('叠 广告');
//
//        q.exec(function(err, results) {
////            console.log(results);
//            var data = new Array();
//            for(var i=0;i<results.length;++i){
//                var result = results[i];
////                console.log(result);
//                var date_serial = result._['发行时间'].format('YYYY年M月DD日') + " 总第" + result['期数'] + "期";
//                var per = {
//                    "title":"外滩画报 - " + date_serial ,
//                    "serial": result['期数'],
//                    "date_serial": date_serial,
//                    "cover": result['封面图']?result['封面图'].url:'',
//                    "sub_cover": get_sub_cover(result['叠']),
//                    "sub_ad": get_sub_ad(result['广告'])
//                };
//                data.push(per);
//            }
//            console.log(data);
//            res.json(data);
//        });
//        Req.getUrl("http://www.bundpic.com/api_app_ios_130.php", res);
    }
}

function get_sub_cover(volumes) {
    var sub_cover = new Array();
    for(var i=0; i< volumes.length; ++i) {
        var volume = volumes[i];
        var vol = {
            "title":volume['名称'],
            "image":volume['封面图']?volume['封面图'].url:'',
//            "category_id":volume['分类'],
            "category_id":'108',
            "article_list":"http://www.bundpic.com/volume/"+volume.id
        };
        sub_cover.push(vol);
    }
    return sub_cover;
}

function get_sub_ad(ads) {
    var sub_ad = new Array();
    for(var i=0; i< ads.length; ++i) {
        var ad = ads[i];
        var sad = {
            "title": ad['广告名'],
            "image": ad['竖图']?ad['竖图'].url:'',
            "image_h": ad['横图']?ad['横图'].url:'',
            "action_type":"AD",
            "timeStamp": ad._['发布时间']?ad._['发布时间'].format('X')+270:'',
            "category_id": '108',
            "unit_width": '1',
            "article_id": '',
            "article_list": '',
            "ad_id": ad.id,
            "url": 'http://www.bundpic.com/ad/'+ad.id
        };
        sub_ad.push(sad);
    }
    return sub_ad;
}