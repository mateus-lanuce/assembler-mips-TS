import { NextFunction, Request, Response } from "express";
import DataBaseError from "../models/errors/database.error.model";
import StatusCodes from "http-status-codes";
import ForbbidenError from "../models/errors/forbbiden.error.model";
import UnauthorizedError from "../models/errors/unauthorized.error.model";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof DataBaseError) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  } else if (error instanceof ForbbidenError) {
    res.sendStatus(StatusCodes.FORBIDDEN);
  } else if (error instanceof UnauthorizedError) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  } else {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default errorHandler;
