import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { InternalServerError } from "../utils/error.utils";
import { ResponseHandler } from "../utils/response.utils";

const { vans } = new PrismaClient();

export const getAllVans: RequestHandler = async (req, res) => {
  try {
    const allVans = await vans.findMany();

    ResponseHandler.success(res, allVans, 200, "All vans fetched successfully");
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong");
  }
};

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

    ResponseHandler.success(res, newVan, 201, "Van created successfully");
  } catch (error) {
    console.error("Error: ", error);
    throw new InternalServerError("Something went wrong");
  }
};
