const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors");

const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		console.log("Auth middleware");
		throw new CustomError.UnauthenticatedError("No token provided");
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { userId: payload.userId };
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Unauthenticated Error");
	}
	next();
};

module.exports = auth;
