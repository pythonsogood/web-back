import path from "node:path";
import "dotenv/config";
import express from "express";
import { router as userRouter } from "./routers/user";
import * as db from "./config/db";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_URI: string;
			PORT: string;
		}
	}
}

const APP_PORT = parseInt(process.env.PORT);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/api/auth", userRouter);

app.listen(APP_PORT, async () => {
	await db.configure();

	console.log(`Server is running on port ${APP_PORT}`);
});

export default app;