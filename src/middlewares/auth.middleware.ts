import { RequestHandler } from "express";
import { UnauthorizedError } from "./error.middleware";

export const isAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(
      new UnauthorizedError("You are not authorized to view this resource.")
    );
  }

  next();
};
