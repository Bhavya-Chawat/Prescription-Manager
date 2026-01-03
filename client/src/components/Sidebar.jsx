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
    <div className="fixed left-0 top-0 h-screen w-56 bg-gray-950 flex flex-col border-r border-gray-800/80">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md shadow-green-500/15">
            <Pill className="w-5 h-5 text-gray-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              PharmaDSA
            </h1>
            <p className="text-[10px] text-gray-500">Smart Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-3 py-3 border-b border-gray-800/80">
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-900/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-gray-950 text-xs font-bold shadow-md shadow-green-500/15">
            {(user?.username || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.username || "User"}
            </p>
            <div className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-green-400" />
              <p className="text-[10px] text-gray-500 capitalize">
                {user?.role || "viewer"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-hidden space-y-0.5">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
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
                w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                ${
                  active
                    ? "bg-green-500 text-gray-950 shadow-md shadow-green-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/80"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${active ? "text-gray-950" : ""}`} />
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-950/30 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-800/80 space-y-0.5">
        <button
          onClick={() => navigate("/settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            isActive("/settings")
              ? "bg-green-500 text-gray-950 shadow-md shadow-green-500/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/80"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
