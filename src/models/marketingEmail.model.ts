import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class MarketingEmail {
	@prop({ required: true })
	subject: string;

	@prop({ required: true, ref: () => User })
	users: Ref<User>[];
}

const MarketingEmailModel = getModelForClass(MarketingEmail, {
	schemaOptions: { timestamps: true },
});

export default MarketingEmailModel;
