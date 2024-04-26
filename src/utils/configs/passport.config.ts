import { PrismaClient } from "@prisma/client";

import fs from "fs";

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Algorithm } from "jsonwebtoken";

const { user } = new PrismaClient();

const PUB_KEY = fs.readFileSync("./pub.pem", "utf8");

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
        return done(null, false, {
          message: "Unauthorized request, invalid token provided.",
        });
      }

      const { password, createdAt, imageUrl, ...userDetails } = isUser;
      const { exp } = payload;

      return done(
        null,
        { ...userDetails, exp },
        {
          message: "User authenticated successfully.",
        }
      );
    } catch (error) {
      done(error, false, { message: "Unauthorized request." });
    }
  })
);

export default passport;
