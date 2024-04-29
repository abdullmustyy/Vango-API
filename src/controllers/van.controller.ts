import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { ResponseHandler } from "../middlewares/response.middleware";

const { van } = new PrismaClient();

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
