import Offer from "../models/Offer.js";

// Get all offers with optional filtering
export const getAllOffers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { offerNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;

    const offers = await Offer.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching offers", error: error.message });
  }
};

// Get single offer
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching offer", error: error.message });
  }
};

// Create offer
export const createOffer = async (req, res) => {
  try {
    const { name, code, discountValue, discountType, validFrom, validTo, minOrder, maxDiscount, usageLimit } = req.body;

    if (!name || !code || !discountValue || !validFrom || !validTo) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const count = await Offer.countDocuments();
    const offerNumber = `OF${String(count + 1).padStart(3, "0")}`;

    const newOffer = new Offer({
      offerNumber,
      name,
      code,
      discountValue,
      discountType: discountType || "Percentage",
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      minOrder: minOrder || 0,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      usage: 0,
      status: "Active",
    });

    await newOffer.save();
    res.status(201).json({ success: true, message: "Offer created", data: newOffer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating offer", error: error.message });
  }
};

// Update offer
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, message: "Offer updated", data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating offer", error: error.message });
  }
};

// Delete offer
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, message: "Offer deleted", data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting offer", error: error.message });
  }
};

// Update offer status
export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["Active", "Inactive"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const offer = await Offer.findByIdAndUpdate(id, { status }, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    res.status(200).json({ success: true, message: "Status updated", data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
