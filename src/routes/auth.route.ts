import { Router } from "express";

import {
  createResetSession,
  signIn,
  signUp,
  resetPassword,
  uploadProfileImage,
  verifyEmailAndOtp,
  resendOtp,
} from "../controllers/auth.controller";

import { isAuth } from "../middlewares/auth.middleware";

import { upload } from "../utils/configs/multer.config";

const authRouter = Router();

// Create session for logged in user
authRouter.get("/auth/create-reset-session", createResetSession);

// Upload image route
authRouter.post("/upload-image", upload.single("image"), uploadProfileImage);

// Signup user route
authRouter.post("/auth/signup", signUp);

// Verify OTP route for authentication
authRouter.post("/auth/otp/verify", verifyEmailAndOtp);

// Resend OTP route for authentication
authRouter.post("/auth/otp/resend", resendOtp);

// Signin user route
authRouter.post("/auth/signin", signIn);

// Reset password route
authRouter.put("/auth/reset-password", resetPassword);

module.exports = authRouter;
