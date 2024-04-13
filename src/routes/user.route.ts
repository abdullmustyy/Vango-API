import { Router } from "express";
import { getUser, updateUser } from "../controllers/user.controller";

const userRouter = Router();

// Get user by username route
userRouter.get("/user/:username", getUser);
// Update user route
userRouter.put("/update-user", updateUser);

module.exports = userRouter;
