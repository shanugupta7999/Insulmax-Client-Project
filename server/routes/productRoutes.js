import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getCategories,
} from "../controllers/productController.js";

const router = express.Router();

// Get all categories
router.get("/categories/list", getCategories);

// Get all products
router.get("/", getAllProducts);

// Get single product
router.get("/:id", getProductById);

// Create new product
router.post("/", createProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

// Update product status
router.patch("/:id/status", updateProductStatus);

export default router;
