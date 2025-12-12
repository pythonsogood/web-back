import path from "node:path";
import express from "express";
import { router as bmiRouter } from "./routers/bmi";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/", bmiRouter);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

export default app;