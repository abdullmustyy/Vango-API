import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client/extension";
import {
  InternalServerError,
  NotFoundError,
} from "../middleware/error.middleware";
import { ResponseHandler } from "../middleware/response.middleware";

const { user } = new PrismaClient();
