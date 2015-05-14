exports = module.exports = function(req, res) {
	var url = req.params.url;
	return res.redirect(url);
}