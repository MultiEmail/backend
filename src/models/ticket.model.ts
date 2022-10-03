import { getModelForClass, prop } from "@typegoose/typegoose";

export class Ticket {
	@prop({ required: true })
	name: string;

	@prop({ required: true })
	subject: string;

	@prop({ required: true })
	email: string;

	@prop({ required: true })
	message: string;

	@prop({ default: false })
	status: "new" | "in_progress" | "solved";
}

const TicketModel = getModelForClass(Ticket, {
	schemaOptions: { timestamps: true },
});

export default TicketModel;
