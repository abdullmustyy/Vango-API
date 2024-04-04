import { Router } from "express";
// Controllers
import { getAllVans, createVan, getVan } from "../controllers/vans.controller";

const vansRouter = Router();
// Get all vans route
vansRouter.get("/vans", getAllVans);
// Get a van route
vansRouter.get("/vans/:id", getVan);
// Create a van route
vansRouter.post("/vans/create", createVan);

module.exports = vansRouter;
