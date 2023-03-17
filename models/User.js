const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

require("dotenv").config;
const TaskSchema = new mongoose.Schema(
	{
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
	},
	{ timestamps: true }
);

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Must provide name"],
			trim: true,
			maxlength: [20, "Name cannot be more than 20 characters"],
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Must provide email"],
			validator: {
				validator: validator.isEmail,
				message: "Please provide valid email",
			},
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
	},
	{ timestamps: true }
);
UserSchema.index({ email: 1 }, { unique: true });

// UserSchema.pre("save", async function (next) {
// 	const salt = await bcrypt.genSalt(9);
// 	const pass = await bcrypt.hash(this.pass, salt);
// 	console.log(`Initial hash: ${pass}`);
// this.pass = await bcrypt.hash(this.pass, salt);
// this.pass = pass;
// 	next();
// });

UserSchema.methods.comparePass = async function (candidatePass) {
	const isMatch = await bcrypt.compare(candidatePass, this.pass);
	return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
