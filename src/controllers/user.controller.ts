import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  NotFoundError,
} from "../middlewares/error.middleware";
import { ResponseHandler } from "../middlewares/response.middleware";

const { user } = new PrismaClient();

const getUser: RequestHandler = async (req, res) => {};

const updateUser: RequestHandler = async (req, res) => {};

export { getUser, updateUser };
