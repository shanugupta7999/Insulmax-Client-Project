import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const AppRoutes = () => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
