import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UserModel, UserDocument } from "../models/user";

class UserController {
	constructor() {}

	public async routePostRegister(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const { name, email, password } = req.body;

		if (typeof name != "string" || typeof email != "string" || typeof password != "string") {
			await res.status(400).json({"message": "name, email and password must be strings"});

			next();
			return;
		}

		const user = await UserModel.create({ "name": name, "email": email, "password": UserModel. });

		await user.save();

		(req.session as any).userId = user._id.toString("hex");

		await res.json({"message": "success"});
	}

	public async routePostLogin(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		const { email, password } = req.body;

		if (typeof email != "string" || typeof password != "string") {
			await res.status(400).json({"message": "email and password must be strings"});

			next();
			return;
		}

		const user = await UserModel.findOne({ "email": email }) as any as UserDocument;

		if (user == null || !user.verify_password(password)) {
			await res.status(401).json({"message": "invalid credentials"});

			next();
			return;
		}

		(req.session as any).userId = user._id.toString("hex");

		await res.json({"message": "success"});
	}

	public async routePostLogout(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {
		req.session.destroy(() => {
			res.json({"message": "success"});
		});
	}

	public async routeGetProfile(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {}
}

declare global {
	var userController: UserController;
}

if (global.userController == undefined) {
	global.userController = new UserController();
}

export const userController = global.userController;