import { NextFunction, Request, Response } from "express";
import ForbbidenError from "../models/errors/forbbiden.error.model";
import usersRepository from "../repositories/users.repository";

async function basicAuthenticationMiddleware(
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

    if (authorizationType !== "Basic" || !token) {
      throw new ForbbidenError("Tipo de autenticação invalida");
    }

    const tokenContent = Buffer.from(token, "base64").toString("utf-8");
    const [username, password] = tokenContent.split(":");

    if (!username || !password) {
      throw new ForbbidenError("Credênciais não preenchidas");
    }

    const user = await usersRepository.findByUsernameandPassword(
      username,
      password
    );

    if (!user) {
      throw new ForbbidenError("Usuário ou senha invalidos");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default basicAuthenticationMiddleware;
