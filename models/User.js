const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "must provide name"],
		trim: true,
		maxlength: [20, "name can not be more than 20 characters"],
	},
	completed: {
		type: Boolean,
		default: false,
	},
	createdAt: Date,
	updatedAt: Date,
	completedAt: Date,
});

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Must provide name"],
		trim: true,
		maxlength: [20, "Name cannot be more than 20 characters"],
	},
	email: {
		type: String,
		required: [true, "Must provide email"],
		// match: /.+\@.+\..+/,
		unique: true,
	},
	pass: {
		type: String,
		required: [true, "Must provide password"],
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verifiedAt: Date,
	tasks: {
		type: [TaskSchema],
	},
});

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(9);
	this.pass = await bcrypt.hash(this.pass, salt);
	next();
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userID: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

UserSchema.methods.comparePass = async function (candidatePass) {
	const isMatch = await bcrypt.compare(candidatePass, this.pass);
	return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
