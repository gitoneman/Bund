//var agent = require('webkit-devtools-agent');
//agent.start();

var Update_From_Old = require('./lib/spider/update_from_old')

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

Update_From_Old();
