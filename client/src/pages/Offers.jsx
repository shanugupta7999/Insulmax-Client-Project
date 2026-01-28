import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaFileExport, FaTrash, FaEdit } from "react-icons/fa";

function Offers() {
  const [offers, setOffers] = useState([
    {
      id: "OF001",
      name: "New Year Sale",
      code: "NY2026",
      discountValue: 20,
      discountType: "Percentage",
      validFrom: "2026-01-01",
      validTo: "2026-01-31",
      usage: 45,
      minOrder: 500,
      maxDiscount: 1000,
      usageLimit: 100,
      status: "Active",
    },
    {
      id: "OF002",
      name: "Flat 100 Off",
      code: "FLAT100",
      discountValue: 100,
      discountType: "Fixed",
      validFrom: "2026-02-01",
      validTo: "2026-02-28",
      usage: 70,
      minOrder: 1000,
      maxDiscount: null,
      usageLimit: null,
      status: "Inactive",
    },
  ]);

  const [filteredOffers, setFilteredOffers] = useState(offers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const filterRef = useRef(null);
  const exportRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountValue: "",
    discountType: "Percentage",
    validFrom: "",
    validTo: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
  });

  // Close dropdowns on outside click
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

  // Filter + Search
  useEffect(() => {
    const filtered = offers.filter(
      (o) =>
        (o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.code.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? o.status === statusFilter : true)
    );
    setFilteredOffers(filtered);
  }, [search, statusFilter, offers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOffer = () => {
    const requiredFields = ["name", "code", "discountValue", "discountType", "validFrom", "validTo", "minOrder"];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        alert(`Please fill ${field}`);
        return;
      }
    }

    const newOffer = {
      id: `OF${String(offers.length + 1).padStart(3, "0")}`,
      name: formData.name,
      code: formData.code,
      discountValue: parseFloat(formData.discountValue),
      discountType: formData.discountType,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      minOrder: parseFloat(formData.minOrder),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      usage: 0,
      status: "Active",
    };

    setOffers([...offers, newOffer]);
    setFormData({
      name: "",
      code: "",
      discountValue: "",
      discountType: "Percentage",
      validFrom: "",
      validTo: "",
      minOrder: "",
      maxDiscount: "",
      usageLimit: "",
    });
    setIsModalOpen(false);
  };

  const toggleStatus = (id) => {
    setOffers(
      offers.map((o) =>
        o.id === id ? { ...o, status: o.status === "Active" ? "Inactive" : "Active" } : o
      )
    );
  };

  const deleteOffer = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const exportData = (type) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Offer Name,Code,Discount,Discount Type,Valid From,Valid To,Usage,Status"]
        .concat(
          filteredOffers.map(
            (o) =>
              `${o.name},${o.code},${o.discountValue},${o.discountType},${o.validFrom},${o.validTo},${o.usage},${o.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type === "csv" ? "offers.csv" : "offers.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  // Stats
  const totalUsage = offers.reduce((sum, o) => sum + o.usage, 0);
  const activeCampaigns = offers.filter((o) => o.status === "Active").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Offer Management
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage all discount offers and campaigns
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.03]"
        >
          Add Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Offers</p>
          <h3 className="text-2xl md:text-3xl font-bold">{offers.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Usage</p>
          <h3 className="text-2xl md:text-3xl font-bold">{totalUsage}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Active Campaigns</p>
          <h3 className="text-2xl md:text-3xl font-bold">{activeCampaigns}</h3>
        </div>
      </div>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm gap-4">
        <input
          type="search"
          placeholder="Search by Offer Name or Code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[45%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex gap-3 flex-wrap md:flex-nowrap relative">
          {/* Filter */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              <FaFilter /> Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {/* Export */}
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
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="text-left text-sm md:text-base font-semibold text-gray-600">
              <th className="p-4">Offer Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((o, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{o.name}</td>
                <td className="p-4">{o.code}</td>
                <td className="p-4">{o.discountValue} {o.discountType === "Percentage" ? "%" : "₹"}</td>
                <td className="p-4">{o.validFrom} - {o.validTo}</td>
                <td className="p-4">{o.usage}/{o.usageLimit || 100}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(o.id)}
                    className={`px-3 py-1 rounded-full text-white font-semibold transition ${
                      o.status === "Active" ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    {o.status}
                  </button>
                </td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button onClick={() => setSelectedOffer(o)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteOffer(o.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 md:p-0">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Add Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label>Offer Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Offer Code *</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Discount Value *</label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Discount Type *</label>
                <select name="discountType" value={formData.discountType} onChange={handleChange} className="px-3 py-2 border rounded-lg">
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Valid From *</label>
                <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Valid To *</label>
                <input type="date" name="validTo" value={formData.validTo} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Min Order Value *</label>
                <input type="number" name="minOrder" value={formData.minOrder} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Max Discount (Optional)</label>
                <input type="number" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>Usage Limit (Optional)</label>
                <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className="px-3 py-2 border rounded-lg"/>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleAddOffer} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
