import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UserModel } from "../models/user";

declare module "express-session" {
	interface SessionData {
		userId: string | undefined;
	}
}

class UserController {
	constructor() {}

	public async routePostRegister(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const { name, email, password } = req.body;

		if (typeof name != "string" || typeof email != "string" || typeof password != "string") {
			await res.status(400).json({"message": "name, email and password must be strings"});

			next();
			return;
		}

		let user;

		try {
			user = await UserModel.create({ "name": name, "email": email, "password": await UserModel.hash_password(password) });
		} catch (error) {
			await res.status(400);

			throw error;
		}

		await user.save();

		req.session.userId = user._id.toString("hex");

		await res.json({"message": "success"});
	}

	public async routePostLogin(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const { email, password } = req.body;

		if (typeof email != "string" || typeof password != "string") {
			await res.status(400).json({"message": "email and password must be strings"});

			next();
			return;
		}

		const user = await UserModel.findOne({ "email": email });

		if (user == null || !await user.verify_password(password)) {
			await res.status(401).json({"message": "invalid credentials"});

			next();
			return;
		}

		req.session.userId = user._id.toString("hex");

		await res.json({"message": "success"});
	}

	public async routePostLogout(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		req.session.destroy(() => {
			res.json({"message": "success"});
		});
	}

	public async routeGetProfile(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		if (req.session.userId == undefined) {
			await res.status(401).json({"message": "not logged in"});

			next();
			return;
		}

		const user = await UserModel.findById(req.session.userId);

		if (user == null) {
			await res.status(404).json({"message": "user not found"});

			next();
			return;
		}

		await res.json({"name": user.name, "email": user.email});
	}
}

declare global {
	var userController: UserController;
}

if (global.userController == undefined) {
	global.userController = new UserController();
}

export const userController = global.userController;