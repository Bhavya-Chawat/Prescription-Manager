import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ShoppingCart,
  History,
  Settings,
  LogOut,
  Pill,
  Shield,
} from "lucide-react";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/prescriptions", label: "Prescriptions", icon: FileText },
    { path: "/queue", label: "Queue", icon: Users },
    { path: "/dispense", label: "Dispense", icon: ShoppingCart },
    { path: "/history", label: "History", icon: History },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-950 flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Pill className="w-6 h-6 text-gray-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              PharmaDSA
            </h1>
            <p className="text-xs text-gray-500">Smart Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/80">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-gray-950 font-bold shadow-lg shadow-green-500/20">
            {(user?.username || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username || "User"}
            </p>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-green-400" />
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "viewer"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-green-500 text-gray-950 shadow-lg shadow-green-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? "text-gray-950" : ""}`} />
              {item.label}
              {active && (
                <span className="ml-auto w-2 h-2 rounded-full bg-gray-950/30 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <button
          onClick={() => navigate("/settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive("/settings")
              ? "bg-green-500 text-gray-950 shadow-lg shadow-green-500/25"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
