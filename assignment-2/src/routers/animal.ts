import express from "express";
import { animalController } from "../controllers/animal";

export const router = express.Router();

router.get("/random_fox", animalController.routeGetRandomFox.bind(animalController));