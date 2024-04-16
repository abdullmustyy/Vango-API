import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { ResponseHandler } from "../middlewares/response.middleware";
import { hashPassword } from "../utils/auth.util";
import { cloudinary } from "../configs/cloudinary.config";
import { unlink } from "fs";

const { user } = new PrismaClient();

const uploadProfileImage: RequestHandler = async (req, res) => {
  try {
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
        throw new BadRequestError(
          "An error occurred while deleting the image."
        );
    });

    // Send the image URL in the response
    ResponseHandler.success(
      res,
      { imageUrl },
      200,
      "Image uploaded successfully."
    );
  } catch (error: any) {
    ResponseHandler.error(res, error.statusCode, error.message);
  }
};

const register: RequestHandler = async (req, res) => {
  try {
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
    const hashedPasword = await hashPassword(password);

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
        name: true,
        imageUrl: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    // Send the new user in the response
    ResponseHandler.success(res, newUser, 201, "User registered successfully.");
  } catch (error: any) {
    ResponseHandler.error(res, error.statusCode, error.message);
  }
};

const login: RequestHandler = async (req, res) => {};

const generateOTP: RequestHandler = async (req, res) => {};

const verifyOTP: RequestHandler = async (req, res) => {};

const createResetSession: RequestHandler = async (req, res) => {};

const resetPassword: RequestHandler = async (req, res) => {};

export {
  register,
  login,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  uploadProfileImage,
};
