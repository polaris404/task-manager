const express = require("express");
const app = express();
const tasksOld = require("./routes/tasksold");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");
const connectDB = require("./db/connect");
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/auth");

// middleware
app.use(express.static("./public"));
app.use(express.json());

// routes
app.use("/auth", authRouter);
app.use("/api/v1/tasks", tasksOld);
app.use("/tasks", tasksRouter);
app.route("/").get((req, res) => {
	res.redirect("/tasks");
});

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log(`Connected to DB...`);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
