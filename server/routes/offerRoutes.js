import express from "express";
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  updateOfferStatus,
} from "../controllers/offerController.js";

const router = express.Router();

router.get("/", getAllOffers);
router.get("/:id", getOfferById);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);
router.patch("/:id/status", updateOfferStatus);

export default router;
