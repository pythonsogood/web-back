import path from "node:path";
import "dotenv/config";
import express from "express";
import { router as authRouter } from "./routers/auth";
import * as db from "./config/db";
import session from "express-session";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_URI: string;
			PORT: string;
			SESSION_SECRET: string;
			JWT_SECRET: string;
			USE_BCRYPT: string;
		}
	}
}

const APP_PORT = parseInt(process.env.PORT);
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(session({
	name: "sid",
	secret: SESSION_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 1 * 60 * 60 * 1000,
	},
}));
app.use("/api/auth", authRouter);

app.listen(APP_PORT, async () => {
	await db.configure();

	console.log(`Server is running on port ${APP_PORT}`);
});

export default app;