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
]; // Fin de validateUserRequest

export const validateRestauranteRequest = [
	body("restauranteName")
		.notEmpty()
		.withMessage("EL nombre del restaurante es requerido"),

	body("city").notEmpty().withMessage("La ciudad debe ser requerida"),

	body("country").notEmpty().withMessage("El pais es requerido"),

	body("deliveryPrice")
		.notEmpty()
		.withMessage("EL nombre del restaurante es requerido"),

	body("estimatedDeliveryTime")
		.isFloat({ min: 0 })
		.withMessage("El tiempo estimado de entrefa debe ser un numero positivo"),

	body("cuisines")
		.isArray()
		.withMessage("Los platillos deben ser arreglo")
		.not()
		.isEmpty()
		.withMessage("El arreglo de platillos no puede estar vacio"),

	body("menuItems").isArray().withMessage("Los platillos deben ser un arreglo"),

	body("menuItems.*.name")
		.notEmpty()
		.withMessage("El nombre del utem del menú es requerido"),

	body("menuItems.*.price")
		.isFloat({ min: 0 })
		.withMessage(
			"El precio del item del menú es requerido y debe ser un npumero positivo"
		),

	handleValidationErrors,
]; // FIn de validateREstauranteRequest
