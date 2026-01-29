import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaFileExport,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

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

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(API_BASE_URL);
      
      if (search) url.searchParams.append("search", search);
      if (statusFilter) url.searchParams.append("status", statusFilter);
      if (categoryFilter) url.searchParams.append("category", categoryFilter);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      const list = data.data || [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter, categoryFilter]);

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
  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      offer: product.offer || "",
      description: product.description || "",
      category: product.category,
      subcategory: product.subcategory || "",
      basePrice: product.basePrice,
      discount: product.discount || 0,
      finalPrice: product.finalPrice,
    });
    setVariants(product.variants || [{ name: "", price: "", sku: "" }]);
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  // Create or Update product
  const handleAddProduct = async () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.basePrice) {
      alert("Please fill required fields: Name, Category, Base Price");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          variants: variants.filter(v => v.name && v.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Failed to ${editingId ? 'update' : 'add'} product`);
      }

      alert(`Product ${editingId ? 'updated' : 'added'} successfully!`);
      
      // Reset form and refresh data
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
      setEditingId(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete product");
      }

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Update product status
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
      fetchProducts();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  }

  // Export
  const exportData = (type) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Category,Price,Variants,Commission,Status"]
        .concat(
          products.map(
            (p) =>
              `${p._id},${p.name},${p.category},${p.finalPrice || p.basePrice},${p.variants.length},${p.commission},${p.status}`
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
                  ₹{item.finalPrice || item.basePrice}
                </td>
                <td className="p-4">{item.variants.length}</td>
                <td className="p-4">{item.commission}</td>
                <td className="p-4">
                  <span
                    onClick={() => handleUpdateStatus(item._id, item.status)}
                    className={`px-3 py-1 text-xs rounded-full font-semibold cursor-pointer transition ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item._id)}
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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Product" : "Add Product"}</h2>

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
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
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
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? "Update Product" : "Save Product"}
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
