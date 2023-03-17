const CustomError = require("../errors");
const Token = require("../models/Token");
const { attachCookiesToResponse, isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
	const { refreshToken, accessToken } = req.signedCookies;

	try {
		if (accessToken) {
			const payload = isTokenValid(accessToken);
			req.user = payload.user;
			return next();
		}
		const payload = isTokenValid(refreshToken);
		const existingToken = await Token.findOne({
			user: payload.user.userId,
			refreshToken: payload.refreshToken,
		});
		if (!existingToken || !existingToken?.isValid) {
			throw new CustomError.ForbiddenError("Unauthenticated Error");
		}

		attachCookiesToResponse({
			res,
			user: payload.user,
			refreshToken: existingToken.refreshToken,
		});
		req.user = payload.user;
		next();
	} catch (error) {
		throw new CustomError.ForbiddenError("Unauthenticated Error");
	}
};

module.exports = { authenticateUser };
// module.exports = auth;
