import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../interfaces/user.interface";
import { comparePassword } from "../auth.util";

const { user } = new PrismaClient();

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
      done(error);
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
