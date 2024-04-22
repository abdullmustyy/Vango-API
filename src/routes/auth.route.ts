import { Router } from "express";
import {
  createResetSession,
  generateOTP,
  signin,
  signup,
  resetPassword,
  uploadProfileImage,
  verifyOTP,
} from "../controllers/auth.controller";
import { upload } from "../utils/configs/multer.config";
import passport from "../utils/configs/passport.config";
import { BadRequestError } from "../middlewares/error.middleware";

const authRouter = Router();

// Generate OTP route for authentication
authRouter.get("/auth/generate-otp", generateOTP);

// Verify OTP route for authentication
authRouter.get("/auth/verify-otp", verifyOTP);

// Create session for logged in user
authRouter.get("/auth/create-reset-session", createResetSession);

// Upload image route
authRouter.post("/upload-image", upload.single("image"), uploadProfileImage);

// Signup user route
authRouter.post("/auth/signup", signup);

// Register user with email route
authRouter.post("/auth/register-mail");

// Authenticate user route
authRouter.post("/auth/authenticate");

// Signin user route
authRouter.post(
  "/auth/signin",
  passport.authenticate("local", {
    failureMessage: "Invalid username or password.",
  }),
  signin
);

authRouter.get("/login-success", (req, res, next) => {
  res.send("You successfully logged in.");
});
authRouter.get("/login-failure", (req, res, next) => {
  res.send("You failed to log in.");
});

// Reset password route
authRouter.put("/auth/reset-password", resetPassword);

module.exports = authRouter;
