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
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed md:static z-50  bg-white text-black min-h-screen w-64 flex flex-col transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b ">
          <h2 className="text-lg font-bold">Company Name</h2>
          <FaTimes
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu */}
        <ul className="mt-4 space-y-1 flex-1 p-1">
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 transition cursor-pointer rounded-lg
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-yellow-300"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </ul>

        {/* Logout */}
        <div className="border-t p-4">
          <button
            className="flex text-white items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
