import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../utils/error.utils";
import { ResponseHandler } from "../utils/response.utils";

const { vans } = new PrismaClient();

// Get all vans
export const getAllVans: RequestHandler = async (req, res) => {
  try {
    const allVans = await vans.findMany();

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
    const { id } = req.params;

    const van = await vans.findUnique({
      where: {
        id,
      },
    });

    if (!van) {
      return new NotFoundError("Van not found.");
    }

    ResponseHandler.success(res, van, 200, "Van fetched successfully.");
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong");
  }
};

// Get vans by host id
export const getHostVans: RequestHandler = async (req, res) => {
  try {
    const { hostId } = req.params;

    const hostVans = await vans.findMany({
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

    const hostVan = await vans.findFirst({
      where: {
        id: vanId,
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
    const newVan = await vans.create({
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
