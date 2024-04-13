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
  try {
    const allVans = await van.findMany();

    ResponseHandler.success(
      res,
      allVans,
      200,
      "All vans fetched successfully."
    );
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong.");
  }
};

// Get a van by id
export const getVan: RequestHandler = async (req, res) => {
  try {
    const { vanId } = req.params;

    const foundVan = await van.findUnique({
      where: {
        vanId,
      },
    });

    if (!foundVan) {
      return new NotFoundError("Van not found.");
    }

    ResponseHandler.success(res, foundVan, 200, "Van fetched successfully.");
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong");
  }
};

// Get vans by host id
export const getHostVans: RequestHandler = async (req, res) => {
  try {
    const { hostId } = req.params;

    const hostVans = await van.findMany({
      where: {
        hostId,
      },
    });

    if (!hostVans) {
      return new NotFoundError("Vans not found for this host.");
    }

    ResponseHandler.success(
      res,
      hostVans,
      200,
      "Host vans fetched successfully"
    );
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong.");
  }
};

// Get a van by host id
export const getHostVan: RequestHandler = async (req, res) => {
  try {
    const { hostId, vanId } = req.params;

    const hostVan = await van.findFirst({
      where: {
        vanId,
        hostId,
      },
    });

    if (!hostVan) {
      return new NotFoundError("Van not found for this host.");
    }

    ResponseHandler.success(res, hostVan, 200, "Host van fetched successfully");
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong.");
  }
};

// Create a van
export const createVan: RequestHandler = async (req, res) => {
  try {
    const { name, description, price, type, imageUrl, hostId } = req.body;
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
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong.");
  }
};
