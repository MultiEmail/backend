import { DocumentDefinition } from "mongoose";
import MarketingEmailModel, { MarketingEmail } from "../models/marketingEmail.model";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/email.util";
import { findUsersService } from "./user.service";

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
 * Send marketing emails to users who have opted in to receive marketing emails.
 * @param {string} html - string - The HTML content of the email
 * @param {string} subject - The subject of the email
 *
 * @author tharun634
 */
export function sendMarketingEmailService(html: string, subject: string) {
	const query = findUsersService({ receiveMarketingEmails: true });
	query.select("email");
	return query.exec().then((users: User[]) => {
		users.map(async (user) => await sendEmail(user.email, subject, html));
	});
}
