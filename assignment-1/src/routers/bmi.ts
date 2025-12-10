import express from "express";
import { bmiController } from "../controllers/bmi";

export const router = express.Router();

router.get("/", async (req, res, next) => {
	res.render("pages/index", {});
});

router.post("/calculate-bmi", bmiController.routeCalculateBMI.bind(bmiController));