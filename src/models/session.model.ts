import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

@index<Session>({ expireAt: 1 })
export class Session {
	@prop({ required: true, ref: () => User })
	user: Ref<User>;

	@prop({ required: true })
	valid: boolean;

	@prop({ default: Date.now(), expires: "15d" })
	expireAt: Date;
}

const SessionModel = getModelForClass(Session, {
	schemaOptions: { timestamps: true },
});

export default SessionModel;
