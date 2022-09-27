import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
	@prop({ required: true })
	email: string;

	@prop({ required: true })
	username: string;

	@prop({ required: true })
	googleId: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
