import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UserModel } from "../models/user";
import { validationResult } from "express-validator";

declare module "express-session" {
	interface SessionData {
		userId: string | undefined;
	}
}

class UserController {
	constructor() {}

	public async routePostRegister(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const validation_result = validationResult(req);

		if (!validation_result.isEmpty()) {
			await res.status(400);

			throw new Error(JSON.stringify(validation_result.array()));
		}

		const { username, email, password } = req.body;

		let user;

		try {
			user = await UserModel.create({ "username": username, "email": email, "password": await UserModel.hash_password(password) });
		} catch (error) {
			await res.status(400);

			throw error;
		}

		await user.save();

		await res.json({"message": "success"});
	}

	public async routePostLogin(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const validation_result = validationResult(req);

		if (!validation_result.isEmpty()) {
			await res.status(400);

			throw new Error(JSON.stringify(validation_result.array()));
		}

		const { email, password } = req.body;

		const user = await UserModel.findOne({ "email": email });

		if (user == null || !await user.verify_password(password)) {
			await res.status(401).json({"message": "invalid credentials"});

			next();
			return;
		}

		await res.json({"message": "success"});
	}

	public async routePostLogout(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
	}

	public async routeGetProfile(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const user = await UserModel.findById(req.session.userId);

		if (user == null) {
			await res.status(404).json({"message": "user not found"});

			next();
			return;
		}

		await res.json({"username": user.username, "email": user.email});
	}
}

declare global {
	var userController: UserController;
}

if (global.userController == undefined) {
	global.userController = new UserController();
}

export const userController = global.userController;