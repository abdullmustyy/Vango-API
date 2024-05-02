import { RequestHandler } from "express";

import passport from "../utils/configs/passport.config";

import { UnauthorizedError } from "./error.middleware";

import { IUser } from "../utils/interfaces/user.interface";

export const isAuth: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: IUser, info: string) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(
          new UnauthorizedError(
            "You are not authorized to access this resource, sign up or sign in to get access."
          )
        );
      }

      // req.user = user;

      next();
    }
  )(req, res, next);
};
