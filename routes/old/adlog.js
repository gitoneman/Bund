var keystone = require('keystone');
var AD = keystone.list('AD');

exports = module.exports = function(req, res) {
    AD.model.findOne().where('_id', req.params.id)
        .exec(function(err, ad) {
            if (err||!ad) {
                console.log("ad not exist");
            } else {
                ad['观看次数']++;
                ad.save(function(err) {
                    if (err) {
                        console.log("ad log failed");
                    } else {
                        console.log("ad log ++ great!");
                    }
                    return;
                });
            }
        });
}