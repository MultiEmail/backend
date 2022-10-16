import { DocumentDefinition } from "mongoose";
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
