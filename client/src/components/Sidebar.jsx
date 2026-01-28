import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaMoneyBill,
  FaChartBar,
  FaGift,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
  { name: "Dealers", path: "/dealers", icon: <FaUsers /> },
  { name: "Affiliates", path: "/affiliates", icon: <FaUsers /> },
  { name: "Products", path: "/products", icon: <FaBox /> },
  { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
  { name: "Payouts", path: "/payouts", icon: <FaMoneyBill /> },
  { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },
  { name: "Offers", path: "/offers", icon: <FaGift /> },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 bg-white min-h-screen w-64 flex flex-col transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Company Name
          </h2>
          <FaTimes
            className="md:hidden text-gray-800 cursor-pointer text-xl"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu */}
        <ul className="flex-1 mt-4 p-2 space-y-1 overflow-y-auto">
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer text-gray-800 ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-yellow-300 hover:text-gray-900"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm md:text-base">{item.name}</span>
            </NavLink>
          ))}
        </ul>

        {/* Logout */}
        <div className="border-t p-4">
          <button
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt className="text-base" />
            <span className="text-sm md:text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
