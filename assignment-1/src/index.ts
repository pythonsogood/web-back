import express from "express";

const app = express();

app.use(express.json());

app.get("/", async (req, res, next) => {
	await res.json({"message": "Hello, World!"});
});

app.post("/calculate-bmi", async (req, res, next) => {
	const {weight, height} = req.body;

	if (weight == undefined || height == undefined) {
		await res.status(400).json({"message": "weight and height should be defined!"});

		return;
	}

	if (typeof weight != "number" || typeof height != "number") {
		await res.status(400).json({"message": "weight and height should be numbers!"});

		return;
	}

	if (height == 0) {
		await res.status(400).json({"message": "height cannot be zero!"});

		return;
	}

	const bmi = weight / (height ** 2);

	await res.json({"bmi": bmi});
});

app.listen(8080, () => {
	console.log("Server is running on port 8080");
});

export default app;