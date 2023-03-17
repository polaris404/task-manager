const express = require("express");
const router = express.Router();

const {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	verifyEmail,
} = require("../controllers/authController");

router.route("/login").get(getLogin).post(postLogin);
router.route("/register").get(getRegister).post(postRegister);
router.route("/verify-email").get(verifyEmail);
module.exports = router;
