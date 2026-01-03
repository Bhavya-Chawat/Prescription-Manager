import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      <Sidebar />
      <Topbar />
      <main className="ml-56 mt-14 p-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
