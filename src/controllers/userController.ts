import { Request, Response } from "express";
// Request es el objeto que recibe datos del frontend
// Response es el objeto que envia datos al frontend
import User from "../models/userModel";

// Función para crear un usuario
const createUser = async (req: Request, res: Response) => {
	// 1. Verificar si el usuario ya existe
	// 2. Crear el usuario si no existe
	// 3. Regresar el objeto usuario al clietne
	try {
		const { auth0Id } = req.body;
		console.log(req.body);
		const existingUser = await User.findOne({ auth0Id });

		if (existingUser) return res.status(200).send();

		const newUser = new User(req.body);
		await newUser.save();

		res.status(201).json(newUser.toObject());
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear usuario" });
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const { name, addressLine1, city, country } = req.body;
		const user = await User.findById(req.userId);

		if (!user)
			return res.status(404).json({ message: "Usuario no encontrado" });
		user.name = name;
		user.addressLin1 = addressLine1;
		user.city = city;
		user.country = country;

		await user.save();
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar usuario" });
	}
};

const getUser = async (req: Request, res: Response) => {
	try {
		console.log("get user");
		const currentUser = await User.findOne({ _id: req.userId });

		if (!currentUser)
			return res.status(404).json({ message: "Usuario no encontrado" });

		res.json(currentUser);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el usuario" });
	}
};

export default {
	createUser,
	updateUser,
	getUser,
};
