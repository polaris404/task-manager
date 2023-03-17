const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const sendEmail = require("./sendEmail");
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const createTokenUser = require("./createTokenUser");

module.exports = {
	createJWT,
	createTokenUser,
	isTokenValid,
	attachCookiesToResponse,
	sendEmail,
	sendVerificationEmail,
	sendResetPasswordEmail,
};
