import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Dealers from "./pages/Dealers";
import Affiliates from "./pages/Affiliates";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payouts from "./pages/Payouts";
import Analytics from "./pages/Analytics";
import Offers from "./pages/Offers";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">
        <Navbar setOpen={setOpen} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/offers" element={<Offers />} />
        </Routes>
      </div>
    </div>
  );
}
