import { Router } from "express";
// Controllers
import {
  getAllVans,
  createVan,
  getVan,
  getHostVans,
  getHostVan,
} from "../controllers/van.controller";

const vanRouter = Router();
// Get all vans route
vanRouter.get("/vans", getAllVans);
// Get a van route
vanRouter.get("/vans/:vanId", getVan);
// Get vans by host id route
vanRouter.get("/host/:hostId/vans", getHostVans);
// Get a van by host id and van id route
vanRouter.get("/host/:hostId/vans/:vanId", getHostVan);
// Create a van route
vanRouter.post("/vans/create", createVan);

module.exports = vanRouter;
