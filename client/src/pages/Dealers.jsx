import React, { useState, useEffect, useRef } from "react";
import {
  FaUserPlus,
  FaFilter,
  FaFileExport,
  FaEllipsisV,
} from "react-icons/fa";

function Dealers() {
  const [dealers, setDealers] = useState([
    {
      id: "DLR001",
      businessName: "Rahul Traders",
      ownerName: "Rahul Verma",
      phone: "9876543210",
      city: "Delhi",
      state: "Delhi",
      status: "Active",
    },
    {
      id: "DLR002",
      businessName: "Amit Enterprises",
      ownerName: "Amit Sharma",
      phone: "9123456789",
      city: "Mumbai",
      state: "Maharashtra",
      status: "Inactive",
    },
  ]);

  const [filteredDealers, setFilteredDealers] = useState(dealers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    tehsil: "",
    city: "",
    state: "",
    pincode: "",
    gst: "",
    address: "",
    image: null,
  });

  const filterRef = useRef(null);
  const exportRef = useRef(null);

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

  useEffect(() => {
    let filtered = dealers.filter(
      (d) =>
        (d.businessName.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? d.status === statusFilter : true) &&
        (locationFilter ? d.city === locationFilter : true),
    );
    setFilteredDealers(filtered);
  }, [search, statusFilter, locationFilter, dealers]);

  const exportData = (type) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Dealer ID,Business Name,Owner Name,Phone,City,State,Status"]
        .concat(
          filteredDealers.map(
            (d) =>
              `${d.id},${d.businessName},${d.ownerName},${d.phone},${d.city},${d.state},${d.status}`,
          ),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      type === "csv" ? "dealers.csv" : "dealers.xlsx",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddDealer = () => {
    const newDealer = {
      id: `DLR${String(dealers.length + 1).padStart(3, "0")}`,
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      status: "Active",
    };

    setDealers([...dealers, newDealer]);
    setIsModalOpen(false);

    setFormData({
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      location: "",
      tehsil: "",
      city: "",
      state: "",
      pincode: "",
      gst: "",
      address: "",
      image: null,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Dealers Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all dealers
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 transition-all duration-300 shadow-lg"
        >
          <FaUserPlus /> Add Dealer
        </button>
      </div>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm gap-4">
        <input
          type="search"
          placeholder="Search Dealer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[45%] px-4 py-2 border rounded-lg"
        />

        <div className="flex gap-3 relative">
          {/* Filter */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <FaFilter /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 space-y-4">
                <div>
                  <label>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label>Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="">All</option>
                    {[...new Set(dealers.map((d) => d.city))].map(
                      (loc, idx) => (
                        <option key={idx}>{loc}</option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FaFileExport /> Export
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
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
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="text-left text-sm font-semibold  text-gray-600">
              <th className="p-4">ID</th>
              <th className="p-4">Business</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              <th className="p-4">State</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((item, index) => (
              <tr key={index} className=" border border-gray-100">
                <td className="p-4">{item.id}</td>
                <td className="p-4">{item.businessName}</td>
                <td className="p-4">{item.ownerName}</td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.city}</td>
                <td className="p-4">{item.state}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <FaEllipsisV />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dealer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Dealer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
              />
              <Input
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="Location (Google)"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <Input
                label="Tehsil / Block"
                name="tehsil"
                value={formData.tehsil}
                onChange={handleChange}
              />
              <Input
                label="City / District"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
              <Input
                label="GST (Optional)"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label>Full Address</label>
                <textarea
                  rows="1"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Picture
                </label>

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-7 h-7 mb-1 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">
                        Click to upload or drag & drop
                      </p>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDealer}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add Dealer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="px-3 py-2 border border-gray-300 rounded-lg" />
  </div>
);

export default Dealers;
