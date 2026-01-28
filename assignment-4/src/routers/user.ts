import express from "express";
import { userController } from "../controllers/user";

export const router = express.Router();

router.post("/register", userController.routePostRegister.bind(userController));
router.post("/login", userController.routePostLogin.bind(userController));
router.post("/logout", userController.routePostLogout.bind(userController));
router.get("/profile", userController.routeGetProfile.bind(userController));