import { Router } from "express";

// Controllers
import {
  getAllVans,
  createVan,
  getVan,
  getHostVans,
  getHostVan,
} from "../controllers/van.controller";

import { isAuth } from "../middlewares/auth.middleware";
import { checkValidity } from "../middlewares/error.middleware";
import {
  createVanSchema,
  getHostVanSchema,
  getHostVansSchema,
  getVanSchema,
} from "../middlewares/validations/van.validation";

const vanRouter = Router();

// Get all vans route
vanRouter.get("/vans", getAllVans);

// Get a van route
vanRouter.get("/vans/:vanId", checkValidity(getVanSchema), getVan);

// Get vans by host id route
vanRouter.get(
  "/host/:hostId/vans",
  isAuth,
  checkValidity(getHostVansSchema),
  getHostVans
);

// Get a van by host id and van id route
vanRouter.get(
  "/host/:hostId/vans/:vanId",
  isAuth,
  checkValidity(getHostVanSchema),
  getHostVan
);

// Create a van route
vanRouter.post(
  "/vans/create",
  isAuth,
  checkValidity(createVanSchema),
  createVan
);

module.exports = vanRouter;
