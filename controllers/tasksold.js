const Task = require("../models/Task");
const User = require("../models/User");
const CustomError = require("../errors");

const getAllTasks = async (req, res) => {
	const { userId } = req.user;
	const user = await User.findOne({ _id: userId });
	const tasks = user.tasks;
	res.status(200).json({ tasks });
};

const createTask = async (req, res) => {
	const { userId } = req.user;
	const { name } = req.body;
	const user = await User.findOne({ _id: userId });
	const obj = {
		name: name,
	};
	user.tasks.push(obj);
	user.save();
	res.status(201).json({ user });
};

const getTask = async (req, res, next) => {
	const { userId } = req.user;
	const { id: taskId } = req.params;
	const user = await User.findOne({ _id: userId });
	const tasks = user.tasks;
	const task = tasks.find((obj) => String(obj._id) === taskId);
	if (!task) {
		throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
	}
	res.status(200).json({ task });
};

const deleteTask = async (req, res, next) => {
	const { id: taskId } = req.params;
	const { userId } = req.user;
	const user = await User.findOne({ _id: userId });
	const index = user.tasks.findIndex((obj) => String(obj._id) === taskId);
	if (index === -1) {
		throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
	}
	user.tasks.splice(index, 1);
	user.save();
	res.status(200).json({ msg: "Deleted" });
};

const updateTask = async (req, res, next) => {
	const { id: taskId } = req.params;
	const { userId } = req.user;
	const { name, completed } = req.body;
	// const user = await User.findOne({ _id: userId });
	// const index = user.tasks.findIndex((obj) => String(obj._id) === taskId);
	// if (index === -1) {
	// 	throw new CustomError.NotFoundError(`No task with id : ${taskId}`);
	// }
	// user.tasks[]

	await User.findOneAndUpdate(
		{ _id: userId, "tasks._id": taskId },
		{
			$set: {
				"tasks.$.name": name,
				"tasks.$.completed": completed,
				"tasks.$.completedAt": Date.now(),
			},
		}
	);
	res.status(200).json({ taskId, completed, name });
};

module.exports = {
	getAllTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
};
