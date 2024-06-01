import { Request, Response, response } from "express";
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
		console.log(req.file);
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

const searchRestaurante = async (req: Request, res: Response) => {
	try {
		const city = req.params.city;
		const searchQuery = (req.query.searchQuery as string) || "";
		const selectedCuisines = (req.query.selectedCuisines as string) || "";
		const sortOptions = (req.query.sortOptions as string) || "lastUpdated";
		const page = parseInt(req.query.page as string) || 1;

		let query: any = {};

		// Esta query se va a utilizar para buscar por ciudad
		// sin diferneciar mayúsculas o minúsculas
		// zacatecas = Zacatecas
		query["city"] = new RegExp(city, "i");

		// Obtenemis las ciudaddes en la base de datos
		const cityCheck = await Restaurante.countDocuments(query);

		if (cityCheck === 0) {
			return res.status(404).json({
				data: [],
				pagination: {
					total: 0,
					page: 1,
					pages: 1,
				},
			});
		}

		// Si existen cocinas en los parámetros de búsqueda
		// las convertimos del texto a un arreglo
		if (selectedCuisines) {
			const cuisinesArray = selectedCuisines
				.split(",")
				.map((cuisine) => new RegExp(cuisine, "i"));

			query["cuisines"] = { $all: cuisinesArray };
		}

		// Por Ejemplo, si en la query tenemos:
		// restauranteName = AppITZ Food
		// cuisines = [pizza, pasta, italian]
		// searchQuery = Pasta
		// La búsqueda regresaría el restaurante APPITZ FooD,
		// dado que contiene la palabra pasta en su tipo de cocina
		if (searchQuery) {
			const searchRegex = new RegExp(searchQuery, "i");
			query["$or"] = [
				{ restauranteName: searchRegex },
				{ cuisines: { $in: [searchRegex] } },
			];
		}

		// tendríamos 2 restaurante por págoma de búsqueda
		const pageSize = 10;

		// skip sirve para irnos al primer restaurante de cada página,
		// por ejemplo la página 1, tiene del 0 al 10,
		// la página 2 del 11 al 19
		// la página 3 del 20 al 29
		const skip = (page - 1) * pageSize;

		const restaurants = await Restaurante.find(query)
			.sort({ [sortOptions]: 1 })
			.skip(skip)
			.limit(pageSize)
			.lean(); // se utiliza para recibir objetos

		const total = await Restaurante.countDocuments(query);

		const response = {
			data: restaurants,
			pagination: {
				total,
				page,
				// Por ejemplo, si tenemos 50 resultaods
				// pageSize=10,
				// Al dividir 50/10 = 5 páginas
				pages: Math.ceil(total / pageSize),
			},
		};
		
		res.json(response);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al buscar el restaurante" });
	}
};

export default {
	getRestaurante,
	createRestaurante,
	updateRestaurante,
	searchRestaurante,
};
