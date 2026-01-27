import { FaBars } from "react-icons/fa";

export default function Navbar({ setOpen }) {
  return (
    <div className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <FaBars
          className="text-xl cursor-pointer md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        />
        <h1 className="text-lg md:text-xl font-semibold">
          Admin Dashboard
        </h1>
      </div>

      <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
    </div>
  );
}
