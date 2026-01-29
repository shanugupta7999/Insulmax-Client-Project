import express from "express";
import {
  getAllDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer,
  updateDealerStatus,
} from "../controllers/dealerController.js";

const router = express.Router();

// Get all dealers
router.get("/", getAllDealers);

// Get single dealer
router.get("/:id", getDealerById);

// Create new dealer
router.post("/", createDealer);

// Update dealer
router.put("/:id", updateDealer);

// Delete dealer
router.delete("/:id", deleteDealer);

// Update dealer status
router.patch("/:id/status", updateDealerStatus);

export default router;
