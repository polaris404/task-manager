const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const ForbiddenError = require("./forbidden");
const UnauthorizedError = require("./unauthorized");

module.exports = {
	CustomAPIError,
	BadRequestError,
	NotFoundError,
	ForbiddenError,
	UnauthorizedError,
};
