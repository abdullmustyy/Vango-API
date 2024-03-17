import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const { vans } = new PrismaClient();

export const getAllVans: RequestHandler = async (req, res) => {
  try {
    const allVans = await vans.findMany();
    res.json({ message: "All vans", allVans });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const createVan: RequestHandler = async (req, res) => {
  try {
    const { name, description, price, type, imageUrl, hostId, host } = req.body;
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
    res.json({ message: "Van created successfully", newVan });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
