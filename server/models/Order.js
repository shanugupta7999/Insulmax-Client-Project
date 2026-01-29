import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    affiliate: { type: String, trim: true },
    dealer: { type: String, trim: true, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, trim: true },
    customerAddress: { type: String, trim: true },
    items: [orderItemSchema],
    product: { type: String, trim: true },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    estimatedCommission: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
