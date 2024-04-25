import { RequestHandler } from "express";

import { unlink } from "fs";

import { PrismaClient } from "@prisma/client";

import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { ResponseHandler } from "../middlewares/response.middleware";

import { sendOtpToMail } from "../services/email.service";

import {
  comparePassword,
  hashPassword,
  generateOtp,
  issueJwt,
} from "../utils/auth.util";
import { IUser } from "../utils/interfaces/user.interface";
import { cloudinary } from "../utils/configs/cloudinary.config";

const { user, otp } = new PrismaClient();

const uploadProfileImage: RequestHandler = async (req, res) => {
  // Destructure the path from the file object
  const { path } = req.file || {};

  // If an image was uploaded, the path will be available
  if (!path) throw new BadRequestError("You have not uploaded any image.");

  // Upload the image to cloudinary
  const uploadedImage = await cloudinary.uploader.upload(path, {
    folder: "Vango",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });

  // Get the image URL
  const imageUrl = uploadedImage.secure_url;

  // Delete the image from the uploads folder
  unlink(path, (err) => {
    if (err)
      throw new BadRequestError("An error occurred while deleting the image.");
  });

  ResponseHandler.success(
    res,
    { imageUrl },
    200,
    "Image uploaded successfully."
  );
};

const signUp: RequestHandler = async (req, res) => {
  // Destructure the required fields from the request body
  const { name, imageUrl, email, username, password } = req.body;

  // Check if the username is already taken
  const isUsernameTaken = await user.findUnique({ where: { username } });

  // If the username is taken, throw an error
  if (isUsernameTaken)
    throw new BadRequestError(
      `Username '${username}' is already taken, please choose another.`
    );

  // Check if the email already exists
  const isEmailExists = await user.findUnique({ where: { email } });

  // If the email exists, throw an error
  if (isEmailExists)
    throw new BadRequestError(
      `A user with the email '${email}' already exists, log in instead.`
    );

  // Pass the password to the hashPassword function for hashing
  const hashedPasword = hashPassword(password);

  // Create a new user
  const newUser = await user.create({
    data: {
      name,
      imageUrl,
      email,
      username,
      password: hashedPasword,
    },
    select: {
      userId: true,
      email: true,
      username: true,
    },
  });

  // Generate a random 6-digit OTP
  const newOtp = generateOtp();

  // Store the OTP for the user
  await otp.create({
    data: {
      userId: newUser.userId,
      otp: newOtp,
      expiry: new Date(Date.now() + 60000),
    },
  });

  // Send the OTP to the user's email
  sendOtpToMail({
    to: email,
    subject: "Vango - One Time Password (OTP)",
    otp: newOtp,
    name: name.split(" ")[0],
  });

  ResponseHandler.success(
    res,
    newUser,
    201,
    "User signed up successfully, an OTP has been sent to your email."
  );
};

const verifyEmailAndOtp: RequestHandler = async (req, res) => {
  // Destructure the email and OTP from the request body
  const { email, otp: verifyOtp } = req.body;

  // Check if the user exists
  const isUser = await user.findUnique({
    where: { email },
    select: {
      userId: true,
      email: true,
      username: true,
    },
  });

  // If the user does not exist, throw an error
  if (!isUser) throw new NotFoundError("User not found.");

  // Check if the OTP is valid
  const isOtpValid = await otp.delete({
    where: { userId: isUser.userId, otp: verifyOtp },
  });

  // If the OTP is invalid, throw an error
  if (!isOtpValid)
    throw new BadRequestError("You have entered an invalid OTP.");

  // Issue a new JWT token for the user
  const accessToken = issueJwt(isUser);

  ResponseHandler.success(
    res,
    { ...isUser, accessToken },
    200,
    "Email and OTP verified successfully."
  );
};

const signIn: RequestHandler = async (req, res) => {
  // Destructure the usernameOrEmail and password from the request body
  const { usernameOrEmail, password } = req.body;

  // Check if the user exists
  const isUser = await user.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    },
  });

  // If the user does not exist, throw an error
  if (!isUser)
    throw new NotFoundError("User not found, please sign up instead.");

  // Check if the password is valid
  const isValidPassword = comparePassword(password, isUser.password);

  // If the password is invalid, throw an error
  if (!isValidPassword)
    throw new BadRequestError("Invalid username or password.");

  // Issue a new JWT token for the user
  const accessToken = issueJwt(isUser);

  // Remove the password from the user object
  const { password: _, ...userWithoutPassword } = isUser;

  ResponseHandler.success(
    res,
    { ...userWithoutPassword, accessToken },
    200,
    "User signed in successfully."
  );
};

const createResetSession: RequestHandler = async (req, res) => {};

const resetPassword: RequestHandler = async (req, res) => {};

export {
  signIn,
  signUp,
  verifyEmailAndOtp,
  createResetSession,
  resetPassword,
  uploadProfileImage,
};
