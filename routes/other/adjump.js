exports = module.exports = function(req, res) {
	var url = req.params.post
	return res.redirect(url);
}