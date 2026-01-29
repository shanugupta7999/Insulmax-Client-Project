import React, { useState, useEffect, useRef } from "react";
import {
  FaUserPlus,
  FaFilter,
  FaFileExport,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/orders";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    dealer: "",
    affiliate: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    product: "",
    quantity: "",
    totalAmount: "",
    estimatedCommission: "",
    notes: "",
  });

  const filterRef = useRef(null);
  const exportRef = useRef(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(API_BASE_URL);
      if (search) url.searchParams.append("search", search);
      if (statusFilter) url.searchParams.append("status", statusFilter);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const list = data.data || [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setIsFilterOpen(false);
      if (exportRef.current && !exportRef.current.contains(e.target))
        setIsExportOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const exportData = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      ["Order ID,Affiliate,Dealer,Customer,Product,Amount,Commission,Date,Status"]
        .concat(
          orders.map(
            (o) =>
              `${o.orderNumber || o.id},${o.affiliate || "-"},${o.dealer || "-"},${o.customerName || o.customer || "-"},${o.product || "-"},${o.totalAmount || o.amount || 0},${o.estimatedCommission || o.commission || 0},${(o.createdAt||o.date)||"-"},${o.status}`
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "orders.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // Edit order - load into modal
  const handleEditOrder = (order) => {
    setFormData({
      dealer: order.dealer || "",
      affiliate: order.affiliate || "",
      customerName: order.customerName || order.customer || "",
      customerPhone: order.customerPhone || "",
      customerAddress: order.customerAddress || "",
      product: order.product || "",
      quantity: order.quantity || order.quantity || "",
      totalAmount: order.totalAmount || order.amount || "",
      estimatedCommission: order.estimatedCommission || order.commission || "",
      notes: order.notes || "",
    });
    setEditingId(order._id || order.id);
    setIsModalOpen(true);
  };

  // Create or update order
  const handleAddOrder = async () => {
    if (!formData.dealer || !formData.customerName || !formData.product) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      const payload = {
        affiliate: formData.affiliate,
        dealer: formData.dealer,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        product: formData.product,
        quantity: Number(formData.quantity) || 1,
        totalAmount: Number(formData.totalAmount) || 0,
        estimatedCommission: Number(formData.estimatedCommission) || 0,
        notes: formData.notes,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);

      alert(`Order ${editingId ? 'updated' : 'created'} successfully`);
      setFormData({
        dealer: "",
        affiliate: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        product: "",
        quantity: "",
        totalAmount: "",
        estimatedCommission: "",
        notes: "",
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Error saving order:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      alert("Order deleted");
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Update order status
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      alert("Status updated");
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Orders Management</h2>
          <p className="text-sm text-gray-500">Manage all orders here</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-yellow-400 text-white rounded-lg shadow hover:scale-105 transition"
        >
          <FaUserPlus /> Add Order
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Pending Review</p>
          <h3 className="text-2xl font-bold text-yellow-600 mt-1">
            {orders.filter((o) => o.status === "Pending").length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Approved Today</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">
            {orders.filter(
              (o) =>
                o.status === "Approved" &&
                o.date === new Date().toISOString().slice(0, 10)
            ).length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Value</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            ₹{orders.reduce((sum, o) => sum + Number(o.amount || 0), 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Search + Filter + Export */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between gap-4">
        <input
          type="search"
          placeholder="Search Order ID / Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[45%] px-4 py-2 border rounded-lg"
        />

        <div className="flex gap-3 flex-wrap">
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <FaFilter /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow p-4 z-50">
                <label className="text-sm font-semibold">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            )}
          </div>

          <div ref={exportRef} className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FaFileExport /> Export
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                <button
                  onClick={exportData}
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] sm:min-w-[1100px] md:min-w-[1200px] w-full">
          <thead>
            <tr className="text-sm text-gray-600 font-semibold">
              {[
                "Order ID",
                "Affiliate",
                "Dealer",
                "Customer",
                "Product",
                "Amount",
                "Commission",
                "Date",
                "Status",
                "Action",
              ].map((h) => (
                <th key={h} className="p-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4">{o.orderNumber || o.id}</td>
                <td className="p-4">{o.affiliate || "-"}</td>
                <td className="p-4">{o.dealer}</td>
                <td className="p-4">{o.customerName || o.customer}</td>
                <td className="p-4">{o.product}</td>
                <td className="p-4 font-semibold text-blue-600">₹{o.totalAmount || o.amount}</td>
                <td className="p-4 font-semibold text-green-600">₹{o.estimatedCommission || o.commission}</td>
                <td className="p-4">{(o.createdAt || o.date) ? (o.createdAt ? new Date(o.createdAt).toISOString().slice(0,10) : o.date) : "-"}</td>
                <td className="p-4">
                  <span
                    onClick={() => handleUpdateStatus(o._id || o.id, o.status)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      o.status === "Approved"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditOrder(o)}
                      className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(o._id || o.id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition text-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
      <h2 className="text-xl font-semibold mb-4">Add Order</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dealer */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Dealer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dealer"
            placeholder="Enter dealer name"
            value={formData.dealer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Affiliate */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Affiliate (Optional)
          </label>
          <input
            type="text"
            name="affiliate"
            placeholder="Enter affiliate name"
            value={formData.affiliate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Customer Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-800 border-b pb-1">
            Customer Details
          </h3>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customerName"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Customer Phone
          </label>
          <input
            type="text"
            name="customerPhone"
            placeholder="Enter phone number"
            value={formData.customerPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Customer Address
          </label>
          <textarea
            rows="2"
            name="customerAddress"
            placeholder="Enter customer address"
            value={formData.customerAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Section */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-800 border-b pb-1">
            Product Details
          </h3>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Product <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="product"
            placeholder="Enter product name"
            value={formData.product}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            placeholder="Enter total amount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-gray-700">
            Estimated Commission
          </label>
          <input
            type="number"
            name="estimatedCommission"
            placeholder="Enter commission"
            value={formData.estimatedCommission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            rows="2"
            name="notes"
            placeholder="Enter notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 border rounded w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          onClick={handleAddOrder}
          className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
        >
          Add Order
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Orders;
