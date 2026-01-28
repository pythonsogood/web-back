import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { mongo } from "mongoose";
import { User } from "../models/user";
import * as argon2 from "argon2";

class UserController {
	PASSWORD_HASH_OPTIONS: argon2.Options = {
		timeCost: 2,
		memoryCost: 19 * 1000 * 1000,
		parallelism: 1,
		type: argon2.argon2id,
	};

	constructor() {}

	public async hashPassword(password: string): Promise<string> {
		const hashed_password = await argon2.hash(password, this.PASSWORD_HASH_OPTIONS);

		return hashed_password;
	}

	public async verifyPassword(password: string, password_hash: string): Promise<boolean> {
		return await argon2.verify(password_hash, password, this.PASSWORD_HASH_OPTIONS);
	}

	public async routePostRegister(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {}

	public async routePostLogin(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {}

	public async routePostLogout(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {}

	public async routeGetProfile(req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> {}
}

declare global {
	var userController: UserController;
}

if (global.userController == undefined) {
	global.userController = new UserController();
}

export const userController = global.userController;