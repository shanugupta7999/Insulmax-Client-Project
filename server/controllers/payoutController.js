import Payout from "../models/Payout.js";

// Get all payouts with optional filtering
export const getAllPayouts = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { payoutNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;

    const payouts = await Payout.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payouts.length, data: payouts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payouts", error: error.message });
  }
};

// Get single payout
export const getPayoutById = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ success: false, message: "Payout not found" });
    res.status(200).json({ success: true, data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payout", error: error.message });
  }
};

// Create payout
export const createPayout = async (req, res) => {
  try {
    const { type, name, orders, totalAmount, affiliateShare, dealerShare, date } = req.body;
    if (!type || !name || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const count = await Payout.countDocuments();
    const payoutNumber = `PYT${String(count + 1).padStart(3, "0")}`;

    const newPayout = new Payout({
      payoutNumber,
      type,
      name,
      orders: orders || 0,
      totalAmount,
      affiliateShare: affiliateShare || Math.round(totalAmount * 0.9),
      dealerShare: dealerShare || Math.round(totalAmount * 0.1),
      date: date ? new Date(date) : Date.now(),
    });

    await newPayout.save();
    res.status(201).json({ success: true, message: "Payout created", data: newPayout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating payout", error: error.message });
  }
};

// Update payout
export const updatePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const payout = await Payout.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!payout) return res.status(404).json({ success: false, message: "Payout not found" });
    res.status(200).json({ success: true, message: "Payout updated", data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating payout", error: error.message });
  }
};

// Delete payout
export const deletePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const payout = await Payout.findByIdAndDelete(id);
    if (!payout) return res.status(404).json({ success: false, message: "Payout not found" });
    res.status(200).json({ success: true, message: "Payout deleted", data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting payout", error: error.message });
  }
};

// Update payout status
export const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["Pending", "Completed", "Failed"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const payout = await Payout.findByIdAndUpdate(id, { status }, { new: true });
    if (!payout) return res.status(404).json({ success: false, message: "Payout not found" });
    res.status(200).json({ success: true, message: "Status updated", data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
