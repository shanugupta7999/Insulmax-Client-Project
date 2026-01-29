import React, { useState, useEffect, useRef } from "react"; 
import {
  FaUserPlus,
  FaFilter,
  FaFileExport,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/affiliates";

function Affiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    email: "",
    phone: "",
    dealer: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const filterRef = useRef(null);
  const exportRef = useRef(null);

  // Fetch affiliates data from backend
  const fetchAffiliates = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(API_BASE_URL);
      
      if (search) url.searchParams.append("search", search);
      if (statusFilter) url.searchParams.append("status", statusFilter);
      if (locationFilter) url.searchParams.append("location", locationFilter);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      setAffiliates(data.data || []);
    } catch (err) {
      console.error("Full error details:", err);
      setError(`Failed to fetch affiliates: ${err.message}. Make sure the backend is running on http://localhost:5000`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target))
        setIsFilterOpen(false);
      if (exportRef.current && !exportRef.current.contains(event.target))
        setIsExportOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAffiliates();
  }, [search, statusFilter, locationFilter]);

  const exportData = (type) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Affiliate ID,Name,Location,Affiliates,Orders,Total Sales,Commission,Status",
      ]
        .concat(
          affiliates.map(
            (a) =>
              `${a._id},${a.name},${a.city},${a.affiliates},${a.orders},${a.totalSales},${a.commission},${a.status}`,
          ),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      type === "csv" ? "affiliates.csv" : "affiliates.xlsx",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit affiliate - Load affiliate data into form
  const handleEditAffiliate = (affiliate) => {
    setFormData({
      name: affiliate.name,
      profession: affiliate.profession,
      email: affiliate.email,
      phone: affiliate.phone,
      dealer: affiliate.dealer,
      address: affiliate.address,
      city: affiliate.city,
      state: affiliate.state,
      pincode: affiliate.pincode,
    });
    setEditingId(affiliate._id);
    setIsModalOpen(true);
  };

  // Create or Update affiliate - POST or PUT request
  const handleAddAffiliate = async () => {
    const requiredFields = [
      "name",
      "profession",
      "email",
      "phone",
      "dealer",
      "address",
      "city",
      "state",
      "pincode",
    ];
    
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        alert(`Please fill ${field} field`);
        return;
      }
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend Error Response:", data);
        throw new Error(data.message || `HTTP ${response.status}: Failed to ${editingId ? 'update' : 'add'} affiliate`);
      }

      alert(`Affiliate ${editingId ? 'updated' : 'added'} successfully!`);
      
      // Reset form and refresh data
      setFormData({
        name: "",
        profession: "",
        email: "",
        phone: "",
        dealer: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchAffiliates();
    } catch (error) {
      console.error("Full error details:", error);
      alert(`Error: ${error.message}\n\nPlease check the browser console for more details.`);
    }
  };

  // Delete affiliate - DELETE request
  const handleDeleteAffiliate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this affiliate?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete affiliate");
      }

      alert("Affiliate deleted successfully!");
      fetchAffiliates();
    } catch (error) {
      console.error("Error deleting affiliate:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Update affiliate status - PATCH request
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }

      alert("Status updated successfully!");
      fetchAffiliates();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Affiliates Management
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Monitor and manage all affiliates
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03]"
        >
          <FaUserPlus className="text-lg md:text-xl" />
          Add Affiliates
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base text-gray-500">Total Affiliates</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
            {affiliates.length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base text-gray-500">Active Affiliates</p>
          <h3 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
            {affiliates.filter((a) => a.status === "Active").length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base text-gray-500">Total Orders</p>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">
            {affiliates.reduce((sum, a) => sum + a.orders, 0)}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-sm md:text-base text-gray-500">Total Commission</p>
          <h3 className="text-2xl md:text-3xl font-bold text-yellow-600 mt-1">
            ₹
            {affiliates
              .reduce((sum, a) => sum + a.commission, 0)
              .toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm gap-4">
        <input
          type="search"
          placeholder="Search Dealers by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[45%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex gap-3 flex-wrap md:flex-nowrap relative">
          {/* Filter Dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              <FaFilter /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-64 bg-white border border-gray-300 rounded-xl shadow-lg z-50 p-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {[...new Set(affiliates.map((a) => a.city))].map(
                      (loc, idx) => (
                        <option key={idx} value={loc}>
                          {loc}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow"
            >
              <FaFileExport /> Export
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => exportData("csv")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportData("excel")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-[900px] md:min-w-full w-full">
          <thead>
            <tr className="text-left text-sm md:text-base font-semibold text-gray-600">
              <th className="p-4">Affiliate ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Affiliates</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Sales</th>
              <th className="p-4">Commission</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="space-y-3">
            {loading ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Loading affiliates...
                </td>
              </tr>
            ) : affiliates.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No affiliates found
                </td>
              </tr>
            ) : (
              affiliates.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white shadow-sm rounded-lg hover:shadow-md transition"
                >
                  <td className="p-4 font-medium">{item._id}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.city}</td>
                  <td className="p-4">{item.affiliates}</td>
                  <td className="p-4">{item.orders}</td>
                  <td className="p-4 font-semibold text-blue-600">
                    ₹{item.totalSales.toLocaleString()}
                  </td>
                  <td className="p-4 font-semibold text-green-600">
                    ₹{item.commission.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      onClick={() => handleUpdateStatus(item._id, item.status)}
                      className={`px-3 py-1 text-xs md:text-sm font-semibold rounded-full cursor-pointer transition ${
                        item.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditAffiliate(item)}
                        className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAffiliate(item._id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition text-red-600"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 md:p-0">
    <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{editingId ? "Edit Affiliate" : "Add Affiliate"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Profession */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Profession <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="profession"
            placeholder="Enter profession"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Assign Dealer - FULL WIDTH */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Assign To Dealer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dealer"
            placeholder="Dealer name or ID"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.dealer}
            onChange={handleChange}
          />
        </div>

        {/* Address - FULL WIDTH */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Address / Tehsil / Block <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            rows="2"
            placeholder="Enter full address"
            className="px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            City / District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            placeholder="Enter city or district"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-1">
          <label className="text-sm md:text-base font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            placeholder="Enter state"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        {/* Pincode - FULL WIDTH */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm md:text-base font-medium text-gray-700">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            placeholder="Enter pincode"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({
              name: "",
              profession: "",
              email: "",
              phone: "",
              dealer: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
            });
          }}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleAddAffiliate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Update Affiliate" : "Add Affiliate"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Affiliates;
