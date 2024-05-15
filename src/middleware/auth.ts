import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

declare global{
	namespace Express {
		interface Request {
			userId: string,
			auth0Id: string
		}
	}
} // Fin de declare

export const jwtCheck = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	tokenSigningAlg: "RS256",
});

export const jwtParse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers;

	// Los header comenzarán con una cadena
	// Bearer token, por ejemplo
	// Bearer 123xeslfdkadkñs
	// Por lo tanto es necesario verificar que la authorización comience con la cadena Bearer
	if (!authorization || !authorization.startsWith("Bearer"))
		return res.sendStatus(401).json({ message: "Authorización denegada" });

	// Obtener el token del header
	// Bearer 123xeslfdkadkñs
	//		   [    0			  1		   ]
	// split = ["bearer", "123xeslfdkadkñs"]
	const token = authorization.split(" ")[1];
	
	try {
		// Análizamos el token para validar que sea correcto 
		// Decoded decodifica el token diviviendolo en partes
		const decoded = jwt.decode(token) as jwt.JwtPayload;

		// el elemento sub del token contiene el Id del usuario 
		// que inicio sesion en la Api Auth0
		const auth0Id = decoded.sub;

		// Comprobamos qeu exista el usuario en la base de datos
		const user = await User.findOne({ auth0Id })

		if (!user) return res.sendStatus(401).json({ message: 'Authorización denegada'})

			req.auth0Id = auth0Id as string;
			req.userId = user._id.toString();
			next();
	} catch (error) {
		return res.sendStatus(401).json({ message: 'Authorizacón denegada'})
	}

};
