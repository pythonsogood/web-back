import { HydratedDocument, InferSchemaType, Model, model, Schema } from "mongoose";
import * as argon2 from "argon2";
import bcrypt from "bcryptjs";

const PASSWORD_HASH_OPTIONS: argon2.Options = {
	timeCost: 2,
	memoryCost: 19 * 1000 * 1000,
	parallelism: 1,
	type: argon2.argon2id,
};

export interface IUser {
	name: string;
	email: string;
	password: string;
}

export interface UserModelType {
	hash_password(password: string): Promise<string>;
}

const userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
}, {
	collection: "users",
	timestamps: true,
});

userSchema.static("hash_password", async function(password: string): Promise<string> {
	if (process.env.USE_BCRYPT == "1") {
		return await bcrypt.hash(password, 10);
	}

	return await argon2.hash(password, PASSWORD_HASH_OPTIONS);
});

userSchema.method("verify_password", async function(password: string): Promise<boolean> {
	if (process.env.USE_BCRYPT == "1") {
		return await bcrypt.compare(password, this.password);
	}

	return await argon2.verify(this.password, password, PASSWORD_HASH_OPTIONS);
});

export const UserModel = model<typeof userSchema>("User", userSchema);

export type UserDocument = HydratedDocument<InferSchemaType<typeof userSchema>>;


// async function main() {
// 	const user = await UserModel.findOne({ "email": "123" });

// 	user?.verify_password("123");
// }