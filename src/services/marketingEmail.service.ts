import { DocumentDefinition, FilterQuery } from "mongoose";
import MarketingEmailModel, { MarketingEmail } from "../models/marketingEmail.model";

/**
 * Create marketing email in database
 * @param {DocumentDefinition<MarketingEmail>} payload payload which will be used to create marketing email in database
 *
 * @author tharun634
 */
export function createMarketingEmailService(payload: DocumentDefinition<MarketingEmail>) {
	return MarketingEmailModel.create(payload);
}

/**
 * Find marketing emails from database with given query
 * @param {FilterQuery<MarketingEmail>} query filter which will be used to find marketing emails from database
 *
 * @author tharun634
 */
export function findMarketingEmailsService(query?: FilterQuery<MarketingEmail>) {
	return MarketingEmailModel.find(query || {});
}
