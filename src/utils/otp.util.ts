/**
 * This function will create a random 4 digit OTP
 */
export function createRandomOTP(): number {
	return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}
