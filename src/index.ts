import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import mongoose from "mongoose";
import morgan from "morgan";

// Importamos el archivo de ruta de usuarios
import userRoutes from "./routes/userRoutes";

mongoose
	.connect(process.env.DB_CONNECTION_STRING as string)
	.then(() => {
		console.log("Base de datos conectada");
	})
	.catch((error) => {
		console.log("Error al conectarse");
		console.log(error);
	});

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", async (req: Request, res: Response) => {
	res.send({ message: "Servidor OK!" });
});

app.use("/api/user", userRoutes);

const port = process.env.port || 3000;
app.listen(port, () => {
	console.log("App corriendo en el puerto: " + port);
});

// app.get("/", async (req: Request, res: Response) => {
// 	res.json("Hola mundo desde Express y TypeScript, saludos!!!");
// });

// app.listen(3000, () => {
// 	console.log("App corriendo en el puerto: 3000");
// });
