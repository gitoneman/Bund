
exports = module.exports = function(req, res) {
    var json_time = Date.parse(new Date())/1000 + 270;

    var fake = "[{\"url\":\"http:\\/\\/api.mulubao.com\\/thebund_serial_catalog.php?serial=609&type=json\",\"timestamp\":json_time}]";
//    console.log(fake);
    return res.json(fake);
//    Req.getUrl("http://www.bundpic.com/api_app_ios_rsync.php?type=week", res);
}