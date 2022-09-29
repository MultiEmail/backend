import CounterModel from "../models/counter.model";

/**
 * Create a new counter in the database
 * @param {string} _id this is the name of the counter
 */
export function createCounterService(_id: string) {
	return CounterModel.create({ _id, sequence_value: 1 });
}

/**
 * Increment the counter by 1
 * @param _id this is the name of the counter
 */
export function incrementCounterService(_id: string) {
	return CounterModel.findOneAndUpdate(
		{ _id },
		{ $inc: { sequence_value: 1 } },
		{ new: true }
	);
}
