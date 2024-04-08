import { Router } from "express";
// Controllers
import {
  getAllVans,
  createVan,
  getVan,
  getHostVans,
  getHostVan,
} from "../controllers/vans.controller";

const vansRouter = Router();
// Get all vans route
vansRouter.get("/vans", getAllVans);
// Get a van route
vansRouter.get("/vans/:vanId", getVan);
// Get vans by host id route
vansRouter.get("/host/:hostId/vans", getHostVans);
// Get a van by host id and van id route
vansRouter.get("/host/:hostId/vans/:vanId", getHostVan);
// Create a van route
vansRouter.post("/vans/create", createVan);

module.exports = vansRouter;
