import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    payoutNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Affiliate", "Dealer"], required: true },
    name: { type: String, required: true, trim: true },
    orders: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    affiliateShare: { type: Number, default: 0 },
    dealerShare: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Payout", payoutSchema);
