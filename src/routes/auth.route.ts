import { Router } from "express";
import {
  createResetSession,
  generateOTP,
  login,
  register,
  resetPassword,
  uploadProfileImage,
  verifyOTP,
} from "../controllers/auth.controller";
import { upload } from "../configs/multer.config";

const authRouter = Router();

// Generate OTP route for authentication
authRouter.get("/generate-otp", generateOTP);
// Verify OTP route for authentication
authRouter.get("/verify-otp", verifyOTP);
// Create session for logged in user
authRouter.get("/create-reset-session", createResetSession);
// Upload image route
authRouter.post("/upload-image", upload.single("image"), uploadProfileImage);
// Register user route
authRouter.post("/register", register);
// Register user with email route
authRouter.post("/register-mail");
// Authenticate user route
authRouter.post("/authenticate");
// Login user route
authRouter.post("/login", login);
// Reset password route
authRouter.put("/reset-password", resetPassword);

module.exports = authRouter;
