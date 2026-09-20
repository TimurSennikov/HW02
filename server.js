const express = require("express");
const moment = require("moment");

const app = express();

let products = [
	{
		id: 0,
		name: "Телефон",
		price: 10000,
		category: "Техника"
	},
	{
		id: 1,
		name: "Компьютер",
		price: 25000,
		category: "Техника"
	},
	{
		id: 2,
		name: "Мышь",
		price: 500,
		category: "Техника"
	},
	{
		id: 3,
		name: "Клавиатура",
		price: 500,
		category: "Техника"
	},
	{
		id: 4,
		name: "Телефон",
		price: 10000,
		category: "Техника"
	}
];

app.get("/timestamp", (_, res) => {
	res.json({
		full: moment().format("MMMM Do YYYY, h:mm:ss a"),
		time_only: moment().format("LTS")
	});
});

app.get("/health", (_, res) => {
	res.json(
		{
			status: "ok"
		}
	);
});

app.get("/stats", (_, res) => {
	res.json(
		{
			uptime: process.uptime(),
			nodeVersion: process.version,
			timestamp: moment().format("MMMM Do YYYY, h:mm:ss a")

		}
	);
});

app.get("/products", (req, res) => {
	let { take, category } = req.query;

	let prods = products;

	if(category) {
		prods = prods.filter((a) => {a.category == category});
	}

	if(take) {
		prods = prods.slice(0, take);
	}

	res.json(prods);
});

app.get("/product/:id", (req, res) => {
	let { id } = req.params;
	let idNum = Number(id);

	if(!Number.isInteger(idNum) || idNum < 0 || idNum > products.length - 1) {
		return res.status(404).json({
			ok: false,
			description: "Not found"
		});
	}

	return res.json(products[id]);
});

app.listen(8000, "127.0.0.1", () => {
	console.log("Server is running!");
});
