import express from "express";
import multer from "multer";
import restauranteController from "../controllers/restauranteController";
import { validateRestauranteRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5 MB
	},
});

// Rutas para el restaurante

// Ruta para obtener los daots de un restaurante
router.get('/',
	jwtCheck,
	jwtParse,
	restauranteController.getRestaurante,
)

// Rutas para el restaurante
router.post(
	"/",
	jwtCheck,
	jwtParse,
	upload.single("imageFile"),
	validateRestauranteRequest,
	restauranteController.createRestaurante
);

// Ruta para acutalizar un restaurante
router.put("/",
	jwtCheck,
	jwtParse,
	upload.single("imageFile"),
	validateRestauranteRequest,
	restauranteController.updateRestaurante,
)

export default router;
