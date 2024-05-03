import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { ResponseHandler } from "../middlewares/response.middleware";
import { cloudinary } from "../utils/configs/cloudinary.config";
import { unlink } from "fs";

const { van } = new PrismaClient();

export const uploadVanImage: RequestHandler = async (req, res) => {
  // Destructure the path from the file object
  const { path } = req.file || {};

  // If an image was uploaded, the path will be available
  if (!path) throw new BadRequestError("You have not uploaded any image of your van.");

  // Upload the image to cloudinary
  const uploadedImage = await cloudinary.uploader.upload(path, {
    folder: "Vango/vans",
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

// Get all vans
export const getAllVans: RequestHandler = async (req, res) => {
  const vans = await van.findMany();

  ResponseHandler.success(res, vans, 200, "All vans fetched successfully.");
};

// Get a van by id
export const getVan: RequestHandler = async (req, res) => {
  const { vanId } = req.params;

  const vanDetail = await van.findUnique({
    where: {
      vanId,
    },
  });

  if (!vanDetail) {
    throw new NotFoundError("Van not found.");
  }

  ResponseHandler.success(res, vanDetail, 200, "Van fetched successfully.");
};

// Get vans by host id
export const getHostVans: RequestHandler = async (req, res) => {
  const { hostId } = req.params;

  const hostVans = await van.findMany({
    where: {
      hostId,
    },
  });

  if (!hostVans) {
    throw new NotFoundError("Vans not found for this host.");
  }

  ResponseHandler.success(res, hostVans, 200, "Host vans fetched successfully");
};

// Get a van by host id
export const getHostVan: RequestHandler = async (req, res) => {
  const { hostId, vanId } = req.params;

  const hostVan = await van.findFirst({
    where: {
      vanId,
      hostId,
    },
  });

  if (!hostVan) {
    throw new NotFoundError("Van not found for this host.");
  }

  ResponseHandler.success(res, hostVan, 200, "Host van fetched successfully");
};

// Create a van
export const createVan: RequestHandler = async (req, res) => {
  // Get the data from the request body
  const { name, description, price, type, imageUrl, hostId } = req.body;

  // Create a new van
  const newVan = await van.create({
    data: {
      name,
      description,
      price,
      type,
      imageUrl,
      hostId,
    },
  });

  ResponseHandler.success(res, newVan, 201, "Van created successfully.");
};
