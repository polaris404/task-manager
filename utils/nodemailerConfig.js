const config = {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
};
// const config = {
// 	host: "smtp.ethereal.email",
// 	port: 587,
// 	auth: {
// 		user: "carlos.olson12@ethereal.email",
// 		pass: "B1TsNG9tMAs9WPdhz5",
// 	},
// };
module.exports = config;
