import { prop, getModelForClass } from "@typegoose/typegoose";

export class Counter {
	@prop({ required: true, unique: true })
	public _id: string;

	@prop({ required: true })
	public sequence_value: number;
}

const CounterModel = getModelForClass(Counter, {
	schemaOptions: { timestamps: true },
});

export default CounterModel;
