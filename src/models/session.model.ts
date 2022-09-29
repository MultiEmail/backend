import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class Session {
	@prop({ required: true, ref: () => User })
	user: Ref<User>;

	@prop({ required: true })
	valid: boolean;

	@prop({ default: Date.now(), index: { expires: "15d" } })
	expireAt: number;
}

const SessionModel = getModelForClass(Session, {
	schemaOptions: { timestamps: true },
});

export default SessionModel;
