exports = module.exports = function(req, res) {
	var locals = res.locals;
	locals.filters = {
        keyword: req.body.keyword
    };
    console.log(req.body.keyword);
	res.render('site/search');
}