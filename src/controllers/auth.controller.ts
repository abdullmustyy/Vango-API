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
  } catch (error) {
    throw new InternalServerError("Something went wrong.");
  }
};

const register: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPasword = await hashPassword(password);

    // const newUser = await user.create({
    //   data: {
    //     username,
    //     password: hashedPasword,
    //   },
    // });
  } catch (error) {
    throw new InternalServerError("Something went wrong.");
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
