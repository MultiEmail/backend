import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class MarketingEmail {
	@prop({ required: true })
	public subject: string;

	@prop({ required: true, ref: () => User })
	public users: Ref<User>[];
}

const MarketingEmailModel = getModelForClass(MarketingEmail, {
	schemaOptions: { timestamps: true },
});

export default MarketingEmailModel;
