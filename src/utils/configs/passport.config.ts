import { PrismaClient } from "@prisma/client";

import fs from "fs";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Algorithm } from "jsonwebtoken";

import { comparePassword } from "../auth.util";
import { IUser } from "../interfaces/user.interface";

const { user } = new PrismaClient();

const PUB_KEY = fs.readFileSync("/pub.pem", "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"] as Algorithm[],
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const isUser = await user.findUnique({ where: { userId: payload.sub } });

      if (!isUser) {
        return done(null, false);
      }

      return done(null, isUser);
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const isUser = await user.findUnique({ where: { username } });

      if (!isUser) {
        return done(null, false, { message: "Invalid username or password." });
      }

      const isValidPassword = comparePassword(password, isUser.password);

      if (!isValidPassword) {
        return done(null, false, { message: "Invalid username or password." });
      }

      return done(null, isUser);
    } catch (error) {
      done(error, false);
    }
  })
);

// passport.serializeUser((user: any, done) => {
//   console.log("Serialize user: ", user);

//   done(null, user.userId);
// });

// passport.deserializeUser((id: string, done) => {
//   console.log("Deserialize user id: ", id);

//   user
//     .findUnique({ where: { userId: id } })
//     .then((user) => done(null, user))
//     .catch((error) => done(error));
// });

passport.serializeUser(function (user: any, done) {
  console.log("Serialize user: ", user);

  process.nextTick(function () {
    return done(null, {
      userId: user.userId,
      username: user.username,
      imageUrl: user.imageUrl,
    });
  });
});

passport.deserializeUser(function (user: any, done) {
  console.log("Deserialize user: ", user);

  process.nextTick(function () {
    return done(null, user);
  });
});

export default passport;
