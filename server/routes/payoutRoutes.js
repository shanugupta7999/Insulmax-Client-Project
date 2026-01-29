import express from "express";
import {
  getAllPayouts,
  getPayoutById,
  createPayout,
  updatePayout,
  deletePayout,
  updatePayoutStatus,
} from "../controllers/payoutController.js";

const router = express.Router();

router.get("/", getAllPayouts);
router.get("/:id", getPayoutById);
router.post("/", createPayout);
router.put("/:id", updatePayout);
router.delete("/:id", deletePayout);
router.patch("/:id/status", updatePayoutStatus);

export default router;
