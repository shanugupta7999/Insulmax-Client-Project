import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaFileExport,
  FaEllipsisV,
  FaPlus,
} from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([
    {
      id: "PRD001",
      name: "Wireless Mouse",
      category: "Electronics",
      price: 799,
      variants: 2,
      commission: "A",
      status: "Active",
    },
    {
      id: "PRD002",
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 1999,
      variants: 3,
      commission: "D",
      status: "Inactive",
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    offer: "",
    description: "",
    category: "",
    subcategory: "",
    basePrice: "",
    discount: "",
    finalPrice: "",
  });

  const [variants, setVariants] = useState([{ name: "", price: "", sku: "" }]);

  const filterRef = useRef(null);
  const exportRef = useRef(null);

  // Click outside to close filter/export
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

  // Search + filters
  useEffect(() => {
    let filtered = products.filter(
      (p) =>
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? p.status === statusFilter : true) &&
        (categoryFilter ? p.category === categoryFilter : true)
    );
    setFilteredProducts(filtered);
  }, [search, statusFilter, categoryFilter, products]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      finalPrice:
        name === "basePrice" || name === "discount"
          ? calculateFinalPrice(
              name === "basePrice" ? value : prev.basePrice,
              name === "discount" ? value : prev.discount
            )
          : prev.finalPrice,
    }));
  };

  const calculateFinalPrice = (base, discount) => {
    const b = parseFloat(base) || 0;
    const d = parseFloat(discount) || 0;
    return (b - (b * d) / 100).toFixed(2);
  };

  // Variant handlers
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", price: "", sku: "" }]);
  };

  // Add product
  const handleAddProduct = () => {
    const newProduct = {
      id: `PRD${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      name: formData.name,
      category: formData.category,
      price: formData.finalPrice || formData.basePrice,
      variants: variants.length,
      commission: "A",
      status: "Active",
    };

    setProducts((prev) => [...prev, newProduct]);
    setFilteredProducts((prev) => [...prev, newProduct]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      offer: "",
      description: "",
      category: "",
      subcategory: "",
      basePrice: "",
      discount: "",
      finalPrice: "",
    });
    setVariants([{ name: "", price: "", sku: "" }]);
  };

  // Export
  const exportData = (type) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Category,Price,Variants,Commission,Status"]
        .concat(
          filteredProducts.map(
            (p) =>
              `${p.id},${p.name},${p.category},${p.price},${p.variants},${p.commission},${p.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      type === "csv" ? "products.csv" : "products.xlsx"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Products Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all products, variants and pricing
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03]"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total Products" value={products.length} />
        <Stat
          title="Active Products"
          value={products.filter((p) => p.status === "Active").length}
        />
        <Stat title="Categories" value={6} />
        <Stat title="SubCategories" value={14} />
      </div>

      {/* Search + Filter + Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow-sm gap-4">
        <input
          type="search"
          placeholder="Search products by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[45%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3 relative">
          {/* Filter */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <FaFilter /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-lg z-50 p-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All</option>
                    {[...new Set(products.map((p) => p.category))].map(
                      (cat, i) => (
                        <option key={i} value={cat}>
                          {cat}
                        </option>
                      )
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
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => exportData("csv")}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => exportData("excel")}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  Export Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead>
            <tr className="text-left text-sm font-semibold text-gray-600">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Commission</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4 font-semibold text-blue-600">
                  ₹{item.price}
                </td>
                <td className="p-4">{item.variants}</td>
                <td className="p-4">{item.commission}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <FaEllipsisV className="cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Add Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Offer */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Offer / Promotion
                </label>
                <input
                  type="text"
                  name="offer"
                  placeholder="Enter offer"
                  value={formData.offer}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="2"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subcategory */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  placeholder="Enter subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Base Price */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  placeholder="Enter base price"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  placeholder="Enter discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Final Price */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Final Price
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.finalPrice}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Product Variants */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Product Variants</h3>

              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      placeholder="Variant name"
                      value={v.name}
                      onChange={(e) =>
                        handleVariantChange(i, "name", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="Variant price"
                      value={v.price}
                      onChange={(e) =>
                        handleVariantChange(i, "price", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      SKU (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) =>
                        handleVariantChange(i, "sku", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addVariant}
                className="text-blue-600 text-sm font-medium mt-2"
              >
                + Add Variant
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

// Reusable Stat Card
const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
  </div>
);
