import { HydratedDocument, Model, model, Schema } from "mongoose";
import * as argon2 from "argon2";

const PASSWORD_HASH_OPTIONS: argon2.Options = {
	timeCost: 2,
	memoryCost: 19 * 1024,
	parallelism: 1,
	type: argon2.argon2id,
};

export interface IUser {
	name: string;
	email: string;
	password: string;

	verify_password(password: string): Promise<boolean>;
}

export interface UserModelType extends Model<IUser> {
	hash_password(password: string): Promise<string>;
}

const userSchema = new Schema<IUser, UserModelType>({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true, validate: {
		validator: (email: string) => {
			return true;
		},
		message: "invalid email",
	}},
	password: {type: String, required: true},
}, {
	collection: "users",
	timestamps: true,
});

userSchema.static("hash_password", async function(password: string): Promise<string> {
	return await argon2.hash(password, PASSWORD_HASH_OPTIONS);
});

userSchema.method("verify_password", async function(password: string): Promise<boolean> {
	return await argon2.verify(this.password, password, PASSWORD_HASH_OPTIONS);
});

export const UserModel = model<IUser, UserModelType>("User", userSchema);

export type UserDocument = HydratedDocument<IUser>;