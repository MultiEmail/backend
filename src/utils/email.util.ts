import { config } from "dotenv";
import { SendMailOptions, SentMessageInfo, createTransport } from "nodemailer";

config();

const user = process.env.EMAIL_ID as string;
const pass = process.env.EMAIL_PASSWORD as string;

const transporter = createTransport({
	host: "smtppro.zoho.in",
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {
		user,
		pass,
	},
	tls: {
		ciphers: "SSLv3",
	},
});

/**
 * Send Email using nodemailer
 * @param {string} to Email id to send email
 * @param {string} subject Subject of email
 * @param {string} text content of email
 * @return sent message info
 * @author aayushchugh
 */
export function sendEmail(
	to: string,
	subject: string,
	text: string,
): Promise<SentMessageInfo> | undefined {
	if (process.env.NODE_ENV === "test") return;

	const mailOptions: SendMailOptions = {
		from: {
			name: "Multi Email",
			address: user,
		},
		to,
		subject,
		text,
	};

	return transporter.sendMail(mailOptions);
}
