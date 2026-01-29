import express from "express";
import {
  getAllAffiliates,
  getAffiliateById,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  getAffiliateStats,
  updateAffiliateStatus,
} from "../controllers/affiliateController.js";

const router = express.Router();

// Statistics route
router.get("/stats", getAffiliateStats);

// Get all affiliates
router.get("/", getAllAffiliates);

// Get single affiliate
router.get("/:id", getAffiliateById);

// Create new affiliate
router.post("/", createAffiliate);

// Update affiliate
router.put("/:id", updateAffiliate);

// Delete affiliate
router.delete("/:id", deleteAffiliate);

// Update affiliate status
router.patch("/:id/status", updateAffiliateStatus);

export default router;
