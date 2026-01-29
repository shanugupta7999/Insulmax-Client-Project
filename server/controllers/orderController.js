import Order from "../models/Order.js";

// Get all orders with optional filtering
export const getAllOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { dealer: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      affiliate,
      dealer,
      customerName,
      customerPhone,
      customerAddress,
      items,
      product,
      quantity,
      totalAmount,
      estimatedCommission,
      notes,
    } = req.body;

    if (!dealer || !customerName || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // generate simple order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD${String(count + 1).padStart(3, "0")}`;

    const newOrder = new Order({
      orderNumber,
      affiliate,
      dealer,
      customerName,
      customerPhone,
      customerAddress,
      items: items || [],
      product,
      quantity: quantity || 1,
      totalAmount,
      estimatedCommission: estimatedCommission || 0,
      notes,
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: "Order created", data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating order", error: error.message });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting order", error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["Pending", "Approved", "Cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Status updated", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
