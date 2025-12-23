import express from "express";
import path from "node:path";
import "dotenv/config";
import { router as weatherRouter } from "./routers/weather";
import { router as factRouter } from "./routers/fact";
import { router as animalRouter } from "./routers/animal";
import { getIpInfo } from "./util/ip";

const app = express();

app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", "views");

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/api/weather", weatherRouter);
app.use("/api/fact", factRouter);
app.use("/api/animal", animalRouter);

app.get("/", async (req, res, next) => {
	const ip = req.ip || req.ips?.[0] || req.socket.remoteAddress;

	const {country, regionName, city, lat, lon} = ip != undefined && !ip.includes("127.0.0.1") ? await getIpInfo(ip) ?? {} : {"country": "Kazakhstan", "regionName": "Astana", "city": "Astana", "lat": 51.1876, "lon": 71.4491};

	const random_fact = await factController.getRandomFact();
	const today_fact = await factController.getTodayFact();

	const random_fox = await animalController.fetchRandomFoxImage();

	const weather = lat != undefined && lon != undefined ? await weatherController.getCurrentWeather(lat, lon) : null;

	res.render("pages/index", {
		facts: {
			random: random_fact,
			today: today_fact
		},

		animal: {
			fox: random_fox,
		},

		weather: weather,
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

export default app;