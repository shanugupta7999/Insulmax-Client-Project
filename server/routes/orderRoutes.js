import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Get all orders
router.get("/", getAllOrders);

// Get single order
router.get("/:id", getOrderById);

// Create order
router.post("/", createOrder);

// Update order
router.put("/:id", updateOrder);

// Delete order
router.delete("/:id", deleteOrder);

// Update order status
router.patch("/:id/status", updateOrderStatus);

export default router;
