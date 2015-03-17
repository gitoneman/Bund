var CronJob = require('cron').CronJob;
var moment = require('moment');
var job = new CronJob({
    cronTime: "00 * * * * *",
    onTick: function() {
        var now = moment();
        console.log("ticking:"+now.format("hh:mm:ss"));
    },
    start: false
});
job.start();