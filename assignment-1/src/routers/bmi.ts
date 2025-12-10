import express from "express";
import bmiController from "../controllers/bmi";

export const router = express.Router();

router.post("/calculate-bmi", bmiController.routeCalculateBMI.bind(bmiController));