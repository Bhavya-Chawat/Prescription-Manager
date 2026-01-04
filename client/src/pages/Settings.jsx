import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Database,
  Save,
  Info,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import useAuthStore from "../store/authStore";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "system", label: "System Info", icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/30">
                {(user?.username || "A")[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.username || "Admin"}
                </h3>
                <p className="text-gray-500 capitalize">
                  {user?.role || "Admin"} Account
                </p>
                <Badge variant="success" size="sm" className="mt-2" dot>
                  Active
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-info-light rounded-xl border border-info/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    View Only Profile
                  </h4>
                  <p className="text-sm text-gray-600">
                    This is a simplified settings page. Username and role are
                    managed by the system administrator.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username (Read-only)
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600">
                  {user?.username || "Admin"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role (Read-only)
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 capitalize">
                  {user?.role || "Admin"}
                </div>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Application Version", value: "1.0.0" },
                { label: "React Version", value: "18.2.0" },
                { label: "Node.js Version", value: "18.x" },
                { label: "Database", value: "MongoDB" },
                { label: "Last Updated", value: "Jan 3, 2026" },
                { label: "Environment", value: "Development" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-br from-primary-light to-secondary-light rounded-xl border border-primary/20">
              <h4 className="font-medium text-gray-900 mb-2">
                DSA Algorithms Used
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Hash Table (Inventory)",
                  "Min-Heap (Queue)",
                  "Greedy FEFO (Dispense)",
                  "Hash Chain (History)",
                ].map((algo, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-success" />
                    {algo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            View your account and system information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <Card className="lg:col-span-3">
          <CardHeader gradient>
            <h3 className="text-lg font-semibold text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
          </CardHeader>
          <CardContent>{renderTabContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
