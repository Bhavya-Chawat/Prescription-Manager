import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Save,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import useAuthStore from "../store/authStore";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Profile
    username: user?.username || "admin",
    email: "admin@pharmadsa.com",
    phone: "+91 98765 43210",
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    queueAlerts: true,
    // Appearance
    theme: "light",
    compactMode: false,
    // Security
    twoFactor: false,
    sessionTimeout: "30",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System Info", icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/30">
                {settings.username[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {settings.username}
                </h3>
                <p className="text-gray-500 capitalize">
                  {user?.role || "Admin"} Account
                </p>
                <Badge variant="success" size="sm" className="mt-2" dot>
                  Active
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  value={settings.username}
                  onChange={(e) =>
                    setSettings({ ...settings, username: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 capitalize">
                  {user?.role || "Admin"} (Read-only)
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-info-light rounded-xl border border-info/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Notification Preferences
                  </h4>
                  <p className="text-sm text-gray-600">
                    Configure how you want to receive updates and alerts.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  desc: "Receive updates via email",
                  icon: Mail,
                },
                {
                  key: "smsNotifications",
                  label: "SMS Notifications",
                  desc: "Get alerts on your phone",
                  icon: Smartphone,
                },
                {
                  key: "lowStockAlerts",
                  label: "Low Stock Alerts",
                  desc: "Notify when medicines are running low",
                  icon: Bell,
                },
                {
                  key: "queueAlerts",
                  label: "Queue Alerts",
                  desc: "Notify for emergency patients",
                  icon: Bell,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        [item.key]: !settings[item.key],
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings[item.key] ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings[item.key] ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Theme</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() =>
                      setSettings({ ...settings, theme: theme.id })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.theme === theme.id
                        ? "border-primary bg-primary-light"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <theme.icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        settings.theme === theme.id
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        settings.theme === theme.id
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                    >
                      {theme.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Compact Mode</p>
                <p className="text-sm text-gray-500">
                  Reduce spacing for more content
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    compactMode: !settings.compactMode,
                  })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.compactMode ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.compactMode ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-warning-light rounded-xl border border-warning/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Security Settings
                  </h4>
                  <p className="text-sm text-gray-600">
                    Manage your account security preferences.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Key className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, twoFactor: !settings.twoFactor })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactor ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.twoFactor ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
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
            Manage your account and application preferences
          </p>
        </div>
        <Button onClick={handleSave} variant="primary">
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
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
