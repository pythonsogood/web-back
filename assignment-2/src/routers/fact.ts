import express from "express";
import { factController } from "../controllers/fact";

export const router = express.Router();

router.get("/random", factController.routeGetRandomFact.bind(factController));

router.get("/today", factController.routeGetTodayFact.bind(factController));