import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import "dotenv/config";
import passport from "./configs/passport.config";

const app = express();
// Session middleware
app.use(
  session({
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // ms
    },
    secret:
      process.env.PRISMA_STORE_SECRET ?? "worry not the env value was read",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Logger middleware
app.use(morgan("tiny"));

// Data parsing and cors middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Dsaable x-powered-by header
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Welcome to Vango API!");
});

// Dynamically import all routes
readdirSync("./src/routes").map((path) => {
  app.use("/api/v1", require(`./routes/${path}`));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
