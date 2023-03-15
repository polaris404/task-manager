const formDOM = document.querySelector(".task-form");
const nameDOM = document.querySelector(".name");
const emailDOM = document.querySelector(".email");
const passwordDOM = document.querySelector(".pass");

formDOM.addEventListener("submit", async (e) => {
	const name = nameDOM.value;
	const email = emailDOM.value;
	const pass = passwordDOM.value;
	await axios
		.post("/auth/register", { name, email, pass })
		.then((res) => {
			const { token } = res;
			console.log(res);
		})
		.catch((error) => {
			console.log(error);
		});
});
