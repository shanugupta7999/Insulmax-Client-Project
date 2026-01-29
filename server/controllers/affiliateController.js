import Affiliate from "../models/Affiliate.js";

// Get all affiliates with filtering
export const getAllAffiliates = async (req, res) => {
  try {
    const { search, status, location } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
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

    const affiliates = await Affiliate.find(query).populate("dealer");

    res.status(200).json({
      success: true,
      count: affiliates.length,
      data: affiliates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching affiliates",
      error: error.message,
    });
  }
};

// Get single affiliate
export const getAffiliateById = async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id).populate(
      "dealer"
    );

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: affiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching affiliate",
      error: error.message,
    });
  }
};

// Create new affiliate
export const createAffiliate = async (req, res) => {
  try {
    const {
      name,
      profession,
      email,
      phone,
      dealer,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // Check if email already exists
    const existingAffiliate = await Affiliate.findOne({ email });
    if (existingAffiliate) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newAffiliate = new Affiliate({
      name,
      profession,
      email,
      phone,
      dealer,
      address,
      city,
      state,
      pincode,
    });

    await newAffiliate.save();

    res.status(201).json({
      success: true,
      message: "Affiliate created successfully",
      data: newAffiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating affiliate",
      error: error.message,
    });
  }
};

// Update affiliate
export const updateAffiliate = async (req, res) => {
  try {
    const { id } = req.params;

    const affiliate = await Affiliate.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Affiliate updated successfully",
      data: affiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating affiliate",
      error: error.message,
    });
  }
};

// Delete affiliate
export const deleteAffiliate = async (req, res) => {
  try {
    const { id } = req.params;

    const affiliate = await Affiliate.findByIdAndDelete(id);

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Affiliate deleted successfully",
      data: affiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting affiliate",
      error: error.message,
    });
  }
};

// Get affiliate statistics
export const getAffiliateStats = async (req, res) => {
  try {
    const totalAffiliates = await Affiliate.countDocuments();
    const activeAffiliates = await Affiliate.countDocuments({
      status: "Active",
    });
    const inactiveAffiliates = await Affiliate.countDocuments({
      status: "Inactive",
    });

    const stats = await Affiliate.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: "$orders" },
          totalSales: { $sum: "$totalSales" },
          totalCommission: { $sum: "$commission" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAffiliates,
        activeAffiliates,
        inactiveAffiliates,
        ...stats[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

// Update affiliate status
export const updateAffiliateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const affiliate = await Affiliate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Affiliate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Affiliate status updated successfully",
      data: affiliate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating affiliate status",
      error: error.message,
    });
  }
};
