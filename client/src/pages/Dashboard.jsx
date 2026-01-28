export default function Dashboard() {
  const topDealers = [
    { rank: 1, name: "Dealer One", affiliates: 12, orders: 56, amount: "$2,500", commission: "$2,500" },
    { rank: 2, name: "Dealer Two", affiliates: 8, orders: 42, amount: "$1,950", commission: "$1,950" },
    { rank: 3, name: "Dealer Three", affiliates: 5, orders: 30, amount: "$1,700", commission: "$1,700" },
    { rank: 4, name: "Dealer Four", affiliates: 7, orders: 25, amount: "$1,400", commission: "$1,400" },
    { rank: 5, name: "Dealer Five", affiliates: 3, orders: 20, amount: "$1,200", commission: "$1,200" },
  ];

  const pendingActions = [
    { rank: 1, action: "Approve Dealer One", review: "Pending", priority: "High" },
    { rank: 2, action: "Verify Payment", review: "Completed", priority: "Medium" },
    { rank: 3, action: "Update Order Status", review: "Pending", priority: "High" },
    { rank: 4, action: "Check Affiliate Request", review: "Pending", priority: "Low" },
  ];

  const stats = [
    { title: "Total Dealers", value: 120 },
    { title: "Total Affiliates", value: 80 },
    { title: "Total Orders", value: 560 },
    { title: "Total Payout", value: "$12,450" },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Quick summary of your business metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col"
          >
            <span className="text-gray-400 text-sm md:text-base">{stat.title}</span>
            <span className="text-xl md:text-2xl font-bold text-gray-800 mt-2">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Dealers */}
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Top Performing Dealers</h3>
            <span className="text-blue-500 text-sm md:text-base cursor-pointer hover:underline">View All</span>
          </div>

          <table className="w-full text-left table-auto min-w-[500px] md:min-w-full">
            <thead>
              <tr className="text-gray-500 text-sm md:text-base">
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">Dealer Name</th>
                <th className="py-2 px-2">Commission</th>
              </tr>
            </thead>
            <tbody>
              {topDealers.map((dealer) => (
                <tr key={dealer.rank} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-amber-300 text-gray-800 font-bold">
                      {dealer.rank}
                    </div>
                  </td>

                  <td className="py-2 px-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 md:text-base">{dealer.name}</span>
                      <div className="text-gray-500 text-xs md:text-sm mt-1 space-x-3">
                        <span>Affiliates: {dealer.affiliates}</span>
                        <span>Orders: {dealer.orders}</span>
                        <span>Amount: {dealer.amount}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-2 font-semibold text-gray-800 md:text-base">{dealer.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Actions */}
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Pending Actions</h3>
            <span className="text-blue-500 text-sm md:text-base cursor-pointer hover:underline">View All</span>
          </div>

          <table className="w-full text-left table-auto min-w-[500px] md:min-w-full">
            <thead>
              <tr className="text-gray-500 text-sm md:text-base">
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">Actions</th>
                <th className="py-2 px-2">Review</th>
              </tr>
            </thead>
            <tbody>
              {pendingActions.map((item) => (
                <tr key={item.rank} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-red-300 text-gray-800 font-bold">
                      {item.rank}
                    </div>
                  </td>

                  <td className="py-2 px-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 md:text-base">{item.action}</span>
                      <div className="text-gray-500 text-xs md:text-sm mt-1 space-x-3">
                        <span>Priority: {item.priority}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        item.review === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {item.review}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
