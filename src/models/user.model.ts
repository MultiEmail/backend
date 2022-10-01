import { genSalt, hash, compare } from "bcrypt";
import {
	pre,
	prop,
	index,
	getModelForClass,
	Severity,
} from "@typegoose/typegoose";
import {
	createCounterService,
	incrementCounterService,
} from "../services/counter.service";
import { createRandomOTP } from "../utils/otp.util";

export const userModalPrivateFields = [
	"password",
	"__v",
	"verificationCode",
	"passwordResetCode",
];

@index({ uid: 1, email: 1, username: 1 })
@pre<User>("save", async function (next) {
	// create a uid for the user
	if (this.isNew) {
		let counter = await incrementCounterService("user_uid");

		if (!counter) {
			counter = await createCounterService("user_uid");
		}

		if (counter) {
			this.uid = counter.sequence_value;
		}
	}

	// hash password before user is created or updated
	if (!this.isModified("password")) {
		return next();
	}

	const salt = await genSalt(10);
	const hashPassword = await hash(this.password, salt);
	this.password = hashPassword;
	next();
})
export class User {
	@prop({ unique: true })
	public uid: number; // this is not replace `_id` this is serial number of the user

	@prop({ required: true, default: "user" })
	public role: "admin" | "user";

	@prop({ required: true, unique: true })
	public email: string;

	@prop({ required: true, unique: true })
	public username: string;

	@prop({ required: true })
	public password: string;

	@prop({ required: true, default: false })
	public verified: boolean;

	@prop({ required: true, default: () => createRandomOTP() })
	public verificationCode: number;

	@prop()
	public passwordResetCode: string | null;

	// TODO: add more fields for email services

	/**
	 * Check if the password is correct or not
	 * @param password password to compare with the user password
	 */
	public comparePassword(password: string) {
		return compare(password, this.password);
	}
}

const UserModel = getModelForClass(User, {
	schemaOptions: { timestamps: true },
	// setting allow mixed so that we can set password string or null
	options: { allowMixed: Severity.ALLOW },
});

export default UserModel;
