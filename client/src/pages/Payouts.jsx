import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaFileExport, FaMoneyCheckAlt } from "react-icons/fa";

function Payouts() {
  const [payouts, setPayouts] = useState([
    {
      id: "PYT001",
      type: "Affiliate",
      name: "Rahul Traders",
      orders: 120,
      totalAmount: 90000,
      affiliateShare: 81000,
      dealerShare: 9000,
      date: "2026-01-25",
      status: "Pending",
    },
    {
      id: "PYT002",
      type: "Dealer",
      name: "Amit Enterprises",
      orders: 80,
      totalAmount: 60000,
      affiliateShare: 54000,
      dealerShare: 6000,
      date: "2026-01-22",
      status: "Completed",
    },
  ]);

  const [filtered, setFiltered] = useState(payouts);
  const [statusFilter, setStatusFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filterRef = useRef();

  useEffect(() => {
    setFiltered(
      payouts.filter((p) => (statusFilter ? p.status === statusFilter : true)),
    );
  }, [statusFilter, payouts]);

  useEffect(() => {
    let data = payouts.filter(
      (p) =>
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? p.status === statusFilter : true),
    );
    setFiltered(data);
  }, [search, statusFilter, payouts]);

  const pendingPayouts = payouts.filter((p) => p.status === "Pending");
  const pendingAmount = pendingPayouts.reduce((s, p) => s + p.totalAmount, 0);
  const paidThisMonth = payouts
    .filter((p) => p.status === "Completed")
    .reduce((s, p) => s + p.totalAmount, 0);
  const totalPaid = paidThisMonth;

  const handleConfirmPayment = () => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selected.id ? { ...p, status: "Completed" } : p,
      ),
    );
    setSelected(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div
        className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between 
             gap-3 sm:gap-4 md:gap-6 
             p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 
             rounded-2xl shadow-md border border-gray-100">
        {/* Left Content */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">
            Payout Management
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage dealer & affiliate payouts
          </p>
        </div>

        {/* Action Button */}
        <button
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg 
       font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 
       hover:from-green-600 hover:to-emerald-700 
       transition-all duration-300 shadow-md hover:shadow-lg 
       hover:scale-[1.03] active:scale-[0.97]"
        >
          Bulk Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <Stat title="Pending Payouts" value={pendingPayouts.length} />
        <Stat
          title="Pending Amount"
          value={`₹${pendingAmount.toLocaleString()}`}
        />
        <Stat
          title="Paid This Month"
          value={`₹${paidThisMonth.toLocaleString()}`}
        />
        <Stat title="Total Paid" value={`₹${totalPaid.toLocaleString()}`} />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between 
             gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5 
             bg-white rounded-xl shadow-sm">
        {/* Search */}
        <input
          type="search"
          placeholder="Search by Payout ID or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:w-[45%] xl:w-[40%] px-4 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Filter */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 
                 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <FaFilter /> Filter
          </button>

          {isFilterOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 
                      rounded-xl shadow-lg z-50 p-3"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table className="min-w-[1100px] w-full">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-4">Payout ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Name</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Affiliate Share</th>
              <th className="p-4">Dealer Share</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className=" hover:bg-gray-50">
                <td className="p-4">{p.id}</td>
                <td className="p-4">{p.type}</td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.orders}</td>
                <td className="p-4 text-green-600">₹{p.affiliateShare}</td>
                <td className="p-4 text-blue-600">₹{p.dealerShare}</td>
                <td className="p-4">{p.date}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {p.status === "Pending" && (
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full max-w-xl p-4 sm:p-5 md:p-6 
                rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Confirm Payout</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Payout ID" value={selected.id} />
              <Info label="Type" value={selected.type} />
              <Info label="Recipient" value={selected.name} />
              <Info label="Orders" value={selected.orders} />
              <Info
                label="Affiliate Share (90%)"
                value={`₹${selected.affiliateShare}`}
              />
              <Info
                label="Dealer Share (10%)"
                value={`₹${selected.dealerShare}`}
              />
              <Info label="Total Amount" value={`₹${selected.totalAmount}`} />
              <Info label="Date" value={selected.date} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Components */
const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default Payouts;
