import { genSalt, hash, compare } from "bcrypt";
import { pre, prop, index, getModelForClass, Severity } from "@typegoose/typegoose";
import { generateRandomOTP } from "../utils/otp.util";

export const userModalPrivateFields = ["password", "__v", "verificationCode", "passwordResetCode"];

export class ConnectedServices {
	@prop()
	// TODO: make service union type when more services are added
	service: "google";

	@prop()
	refresh_token: string;

	@prop()
	access_token: string;

	@prop()
	email: string;
}

@index({ uid: 1, email: 1, username: 1 })
@pre<User>("save", async function (next) {
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

	@prop({ required: true, default: () => generateRandomOTP() })
	public verificationCode: number;

	@prop()
	public passwordResetCode: number | null;

	@prop({ required: true })
	public acceptedTermsAndConditions: boolean;

	@prop({ required: true, default: false })
	public receiveMarketingEmails: boolean;

	@prop()
	public connected_services: [ConnectedServices];

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
