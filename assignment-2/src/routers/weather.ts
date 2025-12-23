import express from "express";
import { weatherController } from "../controllers/weather";

export const router = express.Router();

router.get("/", weatherController.routeGetWeather.bind(weatherController));