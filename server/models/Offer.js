import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offerNumber: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      default: "Percentage",
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    minOrder: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
