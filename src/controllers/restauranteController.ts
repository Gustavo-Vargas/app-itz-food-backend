import { Request, Response } from "express";
import Restaurante from "../models/restauranteModel";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// Función para obtener los datos de un restaurante
const getRestaurante = async (req: Request, res: Response) => {
	try {
		const restaurante = await Restaurante.findOne({ user: req.userId });
		if (!restaurante)
			return res.status(404).json({ message: "Restaurante no encontrado" });

		res.json(restaurante);
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: "Erro al obtener los datos del restaurante " });
	}
}; // FIn de getRestaurante

// Funcion para crear un resturante
const createRestaurante = async (req: Request, res: Response) => {
	try {
		const existingRestaurante = await Restaurante.findOne({ user: req.userId });

		if (existingRestaurante) {
			return res
				.status(409)
				.json({ message: "El restaurante para este usuario ya existe" });
		}

		const imageUrl = await uploadImage(req.file as Express.Multer.File);

		// Creamos el objeto restaurante y lo almacenamos en la base de datos
		const restaurante = new Restaurante(req.body);
		restaurante.imageUrl = imageUrl;
		restaurante.user = new mongoose.Types.ObjectId(req.userId);
		restaurante.lastUpdated = new Date();

		await restaurante.save();
		res.status(201).send(restaurante);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Erro al crear el restaurante" });
	}
};

// FUncion para actualizar un restaurnate
const updateRestaurante = async (req: Request, res: Response) => {
	try {
		const restaurante = await Restaurante.findOne({ user: req.userId });

		if (!restaurante) {
			return res.status(404).json({ message: "Restaurante no encontrado" });
		}
console.log(req.body);
		restaurante.restauranteName = req.body.restauranteName;
		restaurante.city = req.body.city;
		restaurante.country = req.body.country;
		restaurante.deliveryPrice = req.body.deliveryPrice;
		restaurante.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
		restaurante.cuisines = req.body.cuisines;
		restaurante.menuItems = req.body.menuItems;
		restaurante.lastUpdated = new Date();
console.log(req.file)
		if (req.file) {
			const imageUrl = await uploadImage(req.file as Express.Multer.File);
			restaurante.imageUrl = imageUrl;
		}

		console.log("Restaurante final con imagen", restaurante);

		await restaurante.save();
		res.status(200).send(restaurante);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ message: "Error al actualizar el restaurante" });
	}
};

// FUncion para subir imagen a Cloudinary
const uploadImage = async (file: Express.Multer.File) => {
	// Creamos una url de cloudinary para la imagen del restaurante
	const image = file;

	// Convertimos el objeto de la imagen a un objeto base 64 para poderlo
	// almacenar com oimagen en Cloudinary
	const base64Image = Buffer.from(image.buffer).toString("base64");
	const dataUri = "data:" + image.mimetype + " ;base64," + base64Image;

	console.log("Convertimos el archivo");

	// Subimos la imagen a Cloudinary
	const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

	console.log("termine el uploadImage");
	
	// Retornamos la url de la imagen en CLoudinary
	return uploadResponse.url;
};

export default {
	getRestaurante,
	createRestaurante,
	updateRestaurante,
};
