const formDOM = document.querySelector(".task-form");
const formAlertDOM = document.querySelector(".form-alert");
const emailDOM = document.querySelector(".email");
const passwordDOM = document.querySelector(".pass");

formDOM.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = emailDOM.value;
	const pass = passwordDOM.value;
	try {
		const res = await axios.post("/auth/login", { email, pass });
		if (res.status == 200) {
			formAlertDOM.style.display = "block";
			formAlertDOM.textContent = `Logged In!!!`;
			formAlertDOM.classList.add("text-success");
			setTimeout(() => {
				window.location.assign("http://localhost:3000/");
			}, 3000);
		}
		console.log(res);
	} catch (error) {
		console.log(error);
	}
});
