import express from "express";
import userController from "../controllers/userController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateuserRequest } from "../middleware/validation";

const router = express.Router();

// Ruta para obtener un usuario
router.get("/", jwtCheck, jwtParse, userController.getUser);

// Ruta para crear usuarios
router.post("/", jwtCheck, userController.createUser);

// RUta para actualizar usuarios
router.put(
	"/",
	jwtCheck,
	jwtParse,
	validateuserRequest,
	userController.updateUser
);

export default router;

/* HTTP MEtodos 
    Post    - Agregar datos
    Put     - Actualizar
    Get     - Solicitar
    Delete  - Borrar


*/
