import { Router } from "express";

const userRouter = Router();

// Get user by username route
userRouter.get("/user/:username");
// Update user route
userRouter.put("/update-user");
// Reset password route
userRouter.put("/reset-password");

module.exports = userRouter;
