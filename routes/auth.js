const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	verifyEmail,
	logout,
} = require("../controllers/authController");

router.route("/login").get(getLogin).post(postLogin);
router.route("/register").get(getRegister).post(postRegister);
router.route("/verify-email").get(verifyEmail);
router.route("/logout").delete(authenticateUser, logout);
module.exports = router;
