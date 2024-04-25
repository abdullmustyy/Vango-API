import { Router } from "express";

import {
  createResetSession,
  signIn,
  signUp,
  resetPassword,
  uploadProfileImage,
  verifyEmailAndOtp,
} from "../controllers/auth.controller";

import { isAuth } from "../middlewares/auth.middleware";

import { upload } from "../utils/configs/multer.config";

const authRouter = Router();

// Generate OTP route for authentication
authRouter.get("/auth/generate-otp");

// Create session for logged in user
authRouter.get("/auth/create-reset-session", createResetSession);

// Upload image route
authRouter.post("/upload-image", upload.single("image"), uploadProfileImage);

// Signup user route
authRouter.post("/auth/signup", signUp);

// Verify OTP route for authentication
authRouter.post("/auth/verify", verifyEmailAndOtp);

// Register user with email route
authRouter.post("/auth/register-mail");

// Authenticate user route
authRouter.post("/auth/authenticate");

// Signin user route
authRouter.post("/auth/signin", isAuth, signIn);

// Reset password route
authRouter.put("/auth/reset-password", resetPassword);

module.exports = authRouter;
