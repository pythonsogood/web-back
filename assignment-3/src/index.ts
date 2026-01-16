import path from "node:path";
import "dotenv/config";
import express from "express";
import { connect } from "mongoose";
import { router as blogsRouter } from "./routers/blog";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_CONNECTION: string;
			MONGODB_DB_NAME: string;
			EXPRESS_PORT: string;
		}
	}
}

const APP_PORT = parseInt(process.env.EXPRESS_PORT);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/", blogsRouter);

app.listen(APP_PORT, async () => {
	await connect(process.env.MONGODB_CONNECTION, {dbName: process.env.MONGODB_DB_NAME});

	console.log(`Server is running on port ${APP_PORT}`);
});

export default app;