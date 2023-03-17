const express = require("express");
const router = express.Router();
const path = require("path");

router.route("/").get((req, res) => {
	console.log(req.signedCookies);
	res.status(200).sendFile(path.join(__dirname, "../public/tasks.html"));
});

module.exports = router;
