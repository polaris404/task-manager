const formDOM = document.querySelector(".task-form");
const emailDOM = document.querySelector(".email");
const passwordDOM = document.querySelector(".pass");

formDOM.addEventListener("submit", async (e) => {
	const email = emailDOM.value;
	const pass = passwordDOM.value;
	await axios
		.post("/auth/login", { email, pass })
		.then((res) => {
			console.log(res);
		})
		.catch((error) => {
			console.log(error);
		});
});
