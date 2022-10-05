import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";

/**
 * This middleware will validate the request body using zod schema
 * @param schema schema created using zod
 *
 * @author aayushchugh
 */
function validateRequest(schema: AnyZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({ body: req.body, query: req.query, params: req.params });

			return next();
		} catch (err) {
			if (err instanceof ZodError) {
				switch (err.errors[0].code) {
					case "invalid_string":
						res.status(StatusCodes.UNPROCESSABLE_ENTITY);
						break;

					case "invalid_type":
						res.status(StatusCodes.BAD_REQUEST);
						break;

					case "invalid_enum_value":
						res.status(StatusCodes.UNPROCESSABLE_ENTITY);
						break;

					case "custom":
						res.status(StatusCodes.UNAUTHORIZED);
						break;

					default:
						res.status(StatusCodes.BAD_REQUEST);
						break;
				}
				return res.json({
					error: err.errors[0].message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Internal server error",
			});
		}
	};
}

export default validateRequest;
