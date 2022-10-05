import rateLimit from "express-rate-limit";

/**
 * This middleware will limit the amount of request
 * from particular IP address
 *
 * @constant
 * @author developer-diganta
 */
const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default rateLimiter;
