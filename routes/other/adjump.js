exports = module.exports = function(req, res) {
	var url = req.query.url;
	return res.redirect(url);
}