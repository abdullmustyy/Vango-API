import { Router } from "express";

const authRouter = Router();

// Generate OTP route for authentication
authRouter.get("/generate-otp");
// Verify OTP route for authentication
authRouter.get("/verify-otp");
// Create session for logged in user
authRouter.get("/create-session");
// Register user route
authRouter.post("/register");
// Register user with email route
authRouter.post("/register-mail");
// Authenticate user route
authRouter.post("/authenticate");
// Login user route
authRouter.post("/login");

module.exports = authRouter;
