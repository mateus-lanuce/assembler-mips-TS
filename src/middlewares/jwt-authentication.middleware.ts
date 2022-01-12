import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import ForbbidenError from "../models/errors/forbbiden.error.model";
import UnauthorizedError from "../models/errors/unauthorized.error.model";

async function jwtAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      throw new ForbbidenError("Credenciais não informadas");
    }

    const [authorizationType, token] = authorizationHeader.split(" ");

    if (authorizationType !== "Bearer" || !token) {
      throw new ForbbidenError("Tipo de autenticação invalida");
    }

    try {
      const tokenPayload = JWT.verify(token, "my_secret_key");

    if (typeof tokenPayload !== "object" || !tokenPayload.sub) {
      throw new ForbbidenError("Token Invalido");
    }

    const user = {
      username: tokenPayload.username,
      uuid: tokenPayload.sub,
    };

    req.user = user;
    } catch (error) {
      throw new UnauthorizedError("Token Invalido");
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

export default jwtAuthenticationMiddleware;
