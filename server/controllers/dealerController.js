import Dealer from "../models/Dealer.js";

// Get all dealers with filtering
export const getAllDealers = async (req, res) => {
  try {
    const { search, status, location } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (location) {
      query.city = location;
    }

    const dealers = await Dealer.find(query);

    res.status(200).json({
      success: true,
      count: dealers.length,
      data: dealers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealers",
      error: error.message,
    });
  }
};

// Get single dealer
export const getDealerById = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealer",
      error: error.message,
    });
  }
};

// Create new dealer
export const createDealer = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      location,
      tehsil,
      city,
      state,
      pincode,
      gst,
      address,
      image,
    } = req.body;

    // Check if email already exists
    const existingDealer = await Dealer.findOne({ email });
    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newDealer = new Dealer({
      businessName,
      ownerName,
      email,
      phone,
      location,
      tehsil,
      city,
      state,
      pincode,
      gst,
      address,
      image,
    });

    await newDealer.save();

    res.status(201).json({
      success: true,
      message: "Dealer created successfully",
      data: newDealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating dealer",
      error: error.message,
    });
  }
};

// Update dealer
export const updateDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer updated successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating dealer",
      error: error.message,
    });
  }
};

// Delete dealer
export const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await Dealer.findByIdAndDelete(id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer deleted successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting dealer",
      error: error.message,
    });
  }
};

// Update dealer status
export const updateDealerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const dealer = await Dealer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer status updated successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating dealer status",
      error: error.message,
    });
  }
};
