import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../types/index.type";
import { comparePassword } from "../utils/auth.util";

const { user } = new PrismaClient();

const verifyCallback = async (
  username: string,
  password: string,
  done: (arg0: unknown, arg1?: boolean | IUser) => void
) => {
  try {
    const isUser = await user.findUnique({ where: { username } });

    if (!isUser) {
      return done(null, false);
    }

    const isValidPassword = comparePassword(password, isUser.password);

    if (!isValidPassword) {
      return done(null, false);
    }

    return done(null, isUser);
  } catch (error) {
    done(error);
  }
};

const localStrategy = new LocalStrategy(verifyCallback);

passport.use(localStrategy);

// passport.serializeUser((user: IUser, done) => done(null, user.userId));

export default passport;
