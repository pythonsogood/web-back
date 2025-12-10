import express from "express";
import { router as bmiRouter } from "./routers/bmi";

const app = express();

app.use("/static", express.static("static"));

app.use(bmiRouter);

app.use(express.json());

app.get("/", async (req, res, next) => {
	await res.json({"message": "Hello, World!"});
});

app.listen(8080, () => {
	console.log("Server is running on port 8080");
});

export default app;