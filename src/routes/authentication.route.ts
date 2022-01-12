import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import JWT, { SignOptions } from "jsonwebtoken";
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import ForbbidenError from "../models/errors/forbbiden.error.model";

const authorizationRoute = Router();

authorizationRoute.post(
  "/token/validate",
  jwtAuthenticationMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
  }
);

authorizationRoute.post(
  "/token",
  basicAuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw new ForbbidenError("Usuário não identificado");
      }

      const jwtPayload = { username: user.username };
      const jwtOptions: SignOptions = { subject: user?.uuid};
      const jwtSecretKey = "my_secret_key";

      const jwtToken = JWT.sign(jwtPayload, jwtSecretKey, jwtOptions);

      res.status(StatusCodes.OK).json({ token: jwtToken });
    } catch (error) {
      next(error);
    }
  }
);

export default authorizationRoute;
