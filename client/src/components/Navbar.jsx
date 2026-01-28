import { FaBars } from "react-icons/fa";

export default function Navbar({ setOpen }) {
  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center md:px-6 lg:px-8">
      {/* Left side: Logo / Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <FaBars
          className="text-xl cursor-pointer md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        />
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side: Profile avatar */}
      <div className="flex items-center gap-4">
        {/* You can add notifications or icons here */}
        <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm md:text-base lg:text-lg font-medium">
          U
        </div>
      </div>
    </nav>
  );
}
