const path = require("path");
const User = require("../models/User");

const getLogin = (req, res) => {
	res.status(200).sendFile(path.join(__dirname, "../public/login.html"));
};

const postLogin = async (req, res) => {
	const { email, pass } = req.body;
	if (!email || !pass) {
		throw new Error("Please Provide Email and Password");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("No user!");
	}
	const isMatching = await user.comparePass(pass);
	if (!isMatching) {
		throw new Error("Wrong Password");
	}
	const token = user.createJWT();
	res.status(200).json({ name: user.name, token });
};

const getRegister = (req, res) => {
	res.status(200).sendFile(path.join(__dirname, "../public/register.html"));
};

const postRegister = async (req, res) => {
	const verificationToken = "Fake Token";
	const user = await User.create({ ...req.body, verificationToken });
	// const token = user.createJWT();
	console.log(user);
	// console.log(token);
	// res.status(201).json({ name: user.name, token });
	res
		.status(201)
		.json({ msg: "Success", verificationToken: user.verificationToken });
};
module.exports = { getLogin, postLogin, getRegister, postRegister };
