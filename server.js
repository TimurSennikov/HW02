const express = require("express");
const moment = require("moment");

const app = express();

app.use(express.json());

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
		prods = prods.filter((a) => {return a.category == category;});
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

async function addProduct(newProduct, fail) {
	return new Promise((resolve, reject) => {
		if(fail) {
			return reject();
		}

		products.push(newProduct);
		return resolve();
	});
}

app.post("/products", async (req, res) => {
	let { name, price, category, image } = req.body;
	let { fail } = req.query;

	let priceNum = Number(price);

	if((!name || name.length == 0) || (!priceNum || priceNum <= 0)) {
		return res.status(422).json({
			ok: false,
			description: "Invalid product data"
		});
	}

	if(products.filter((a) => {a.name == name}).length > 0) {
		return res.status(409).json({
			ok: false,
			description: "Conflict"
		});
	}

	let newProduct = {
		id: products.length,
		title: name,
		price: priceNum,
		category: category
	};

	try {
		await addProduct(newProduct, (fail && fail == "true"));
		return res.status(201).json({ok: true, product: newProduct});
	}
	catch(e) {
		return res.status(500).json(ok: false, description: "Internal server error");
	}
});

app.listen(8000, "127.0.0.1", () => {
	console.log("Server is running!");
});
