import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

export const validateuserRequest = [
	body("name").isString().notEmpty().withMessage("EL nombre debe ser string"),

	body("addressLine1")
		.isString()
		.notEmpty()
		.withMessage("La dirección debe ser string"),

	body("city").isString().notEmpty().withMessage("La ciudad debe ser string"),

	body("country").isString().notEmpty().withMessage("El país debe ser string"),
];
