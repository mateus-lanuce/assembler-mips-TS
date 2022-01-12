import { NextFunction, Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import DataBaseError from "../models/errors/database.error.model";
const usersRoute = Router();

import UserRepository from "../repositories/users.repository";

usersRoute.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserRepository.findAllUsers();
      
      res.status(StatusCodes.OK).send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.get(
  "/users/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const user = await UserRepository.findUsersById(uuid);

      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;
      const newUserUuid = await UserRepository.insertUser(user);
      res.status(StatusCodes.CREATED).send(newUserUuid);
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.put(
  "/users/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const modfierUser = req.body;
      modfierUser.uuid = uuid;
      const userUpdate = await UserRepository.userUpdate(modfierUser);

      res.status(StatusCodes.OK).sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  }
);

usersRoute.delete(
  "/users/:uuid",
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const deletedUser = await UserRepository.deleteUser(uuid);

      res.status(StatusCodes.OK).sendStatus(StatusCodes.OK);
    } catch (error) {
      if(error instanceof DataBaseError) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
      } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }
);

export default usersRoute;
