import { getModelForClass, prop } from "@typegoose/typegoose";

export class Ticket {
	@prop({ required: true })
	topic: string;

	@prop({ required: true })
	description: string;

	@prop({ required: true })
	submittedBy: string;

	@prop({ default: false })
	solved: boolean;
}

const TicketModel = getModelForClass(Ticket, {
  schemaOptions: { timestamps: true },
});

export default TicketModel;
