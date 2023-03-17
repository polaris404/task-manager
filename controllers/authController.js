const path = require("path");
const User = require("../models/User");
const CustomError = require("../errors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
	createTokenUser,
	attachCookiesToResponse,
	sendVerificationEmail,
} = require("../utils");
const Token = require("../models/Token");

const getLogin = (req, res) => {
	res.status(200).sendFile(path.join(__dirname, "../public/login.html"));
};

const postLogin = async (req, res) => {
	const { email, pass } = req.body;
	console.log(req.body);
	if (!email || !pass) {
		throw new CustomError.UnauthorizedError(
			"Please Provide Email and Password"
		);
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthorizedError("User does not exist!");
	}
	const isMatching = await user.comparePass(pass);
	if (!isMatching) {
		throw new CustomError.UnauthorizedError("Invalid Credentials");
	}
	if (!user.isVerified) {
		throw new CustomError.ForbiddenError("Please Verify!");
	}
	const tokenUser = createTokenUser(user);
	// const token = createJWT({ payload: tokenUser });

	let refreshToken = "";

	const existingToken = await Token.findOne({ user: user._id });
	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new CustomError.UnauthorizedError("Invalid Credentials");
		}
		refreshToken = existingToken.refreshToken;
		attachCookiesToResponse({ res, user: tokenUser, refreshToken });
		res.status(200).json({ user: tokenUser });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString("hex");
	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };
	await Token.create(userToken);
	attachCookiesToResponse({ res, user: tokenUser, refreshToken });
	console.log("Success");
	res.status(200).json({ user: tokenUser });
	// res.redirect(308, "/tasks");
};

const getRegister = (req, res) => {
	res.status(200).sendFile(path.join(__dirname, "../public/register.html"));
};

const postRegister = async (req, res) => {
	// console.log(req);
	const verificationToken = crypto.randomBytes(40).toString("hex");
	const salt = await bcrypt.genSalt(10);
	req.body.pass = await bcrypt.hash(req.body.pass, salt);
	const user = await User.create({ ...req.body, verificationToken });
	const tokenUser = { name: user.name, userId: user._id };
	// attachCookiesToResponse({ res, user: tokenUser });
	// console.log(user);
	// console.log(token);
	// res.status(201).json({ name: user.name, token });

	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin: "http://localhost:3000",
	});

	res.status(201).json({
		user: tokenUser,
		msg: "Success",
		verificationToken: user.verificationToken,
	});
};

const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.query;
	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthorizedError("User does not exist");
	}
	if (user.verificationToken !== verificationToken) {
		throw new CustomError.UnauthorizedError("Verification Failed");
	}
	user.isVerified = true;
	user.verifiedAt = Date.now();
	user.verificationToken = "";
	await user.save();
	res.redirect(302, "/auth/login");
};

module.exports = {
	getLogin,
	postLogin,
	getRegister,
	postRegister,
	verifyEmail,
};
