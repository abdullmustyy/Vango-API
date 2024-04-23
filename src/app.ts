import express from "express";
import session from "express-session";

import { readdirSync } from "fs";

import cors from "cors";
import morgan from "morgan";
import flash from "connect-flash";

import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import { errorHandler } from "./middlewares/error.middleware";

import passport from "./utils/configs/passport.config";

import "express-async-errors";
import "dotenv/config";

const app = express();
// Dsaable x-powered-by header
app.disable("x-powered-by");

// Logger middleware
app.use(morgan("dev"));

// Data parsing and cors middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // ms
    },
    secret:
      process.env.PRISMA_STORE_SECRET ?? "worry not, the env value was read",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Passport middleware
app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  console.log("Session: ", req.session);
  console.log("User: ", req.user);
  next();
});

// Flash middleware
app.use(flash());

// Dynamically import all routes
readdirSync("./src/routes").map((path) => {
  app.use("/api/v1", require(`./routes/${path}`));
});

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to Vango API!");
});

// Error handler middleware
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
