const express = require("express");
const moment = require("moment");

const app = express();

app.get("/timestamp", (_, res) => {
	res.json({
		full: moment().format("MMMM Do YYYY, h:mm:ss a"),
		time_only: moment().format("LTS")
	});
});

app.listen(8000, "127.0.0.1", () => {
	console.log("Server is running!");
});
