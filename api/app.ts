import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { readdirSync } from "fs";

const app = express();
//Logger
app.use(morgan("tiny"));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Dynamically import all routes
readdirSync("./api/routes").map((path) => {
  app.use("/api/v1/", require(`./routes/${path}`));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
