import React, { useState } from "react";
import {
  HelpCircle,
  X,
  CheckCircle2,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";
import Badge from "./ui/Badge";

const Topbar = () => {
  const user = useAuthStore((s) => s.user);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const helpSections = [
    {
      title: "Dashboard",
      icon: "📊",
      color: "from-blue-500 to-indigo-500",
      description: "Real-time overview of pharmacy operations and metrics.",
      features: [
        "Total stock count and critical/low stock alerts",
        "Medicines in queue awaiting dispense",
        "Today's revenue and bill count",
        "Queue priority distribution (Emergency, High, Normal, Low)",
      ],
    },
    {
      title: "Prescriptions",
      icon: "📋",
      color: "from-cyan-500 to-blue-500",
      description:
        "Create and manage patient prescriptions with auto-queueing.",
      features: [
        "Search prescriptions by ID, patient name, or medicine",
        "Create new prescriptions with multiple medicines",
        "View prescription details with medicine dosages",
        "Automatic queue assignment on creation",
        "Track prescription status (Draft → Queued → Dispensed)",
      ],
    },
    {
      title: "Queue Management",
      icon: "👥",
      color: "from-amber-500 to-orange-500",
      description:
        "Priority-based patient queue powered by Min-Heap algorithm (4 priority levels).",
      features: [
        "Automatic priority ordering: Emergency → High → Normal → Low",
        "Process patients by priority with 'Process Next'",
        "Call next patient to counter",
        "Visual priority indicators",
        "Real-time queue status updates",
      ],
    },
    {
      title: "Dispense Medicine",
      icon: "💊",
      color: "from-emerald-500 to-teal-500",
      description:
        "FEFO (First-Expiry-First-Out) batch allocation using Greedy algorithm.",
      features: [
        "Search and process queued prescriptions",
        "Automatic batch allocation from earliest expiry",
        "Handle partial dispenses and backorders",
        "Generate bills automatically",
        "View allocation details and remaining inventory",
      ],
    },
    {
      title: "Inventory",
      icon: "📦",
      color: "from-pink-500 to-rose-500",
      description:
        "Manage medicine stock with batch tracking and hash table optimization.",
      features: [
        "View all medicines with stock levels and batch details",
        "Add batches with purchase cost and expiry dates",
        "Color-coded alerts: Critical (Red) / Low (Yellow) / Normal (Green)",
        "Search by medicine name for instant results",
        "Track cost and sale price per medicine",
      ],
    },
    {
      title: "History",
      icon: "🔒",
      color: "from-purple-500 to-violet-500",
      description:
        "Immutable audit trail with hash chain (blockchain-like tamper detection).",
      features: [
        "View all dispense records with patient and medicine details",
        "See bills linked to each dispense (Paid/Pending status)",
        "Partial/Success status badges",
        "Hash chain verification for data integrity",
        "Total records count and chain length tracking",
      ],
    },
  ];

  return (
    <>
      <div className="fixed top-0 left-56 right-0 h-14 bg-[#FAFBFA] border-b border-gray-200/80 flex items-center justify-between px-5 z-10">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-sm text-gray-800">
              Pharmacy Management System
            </span>
          </div>
          <Badge variant="primary" size="xs">
            <Sparkles className="w-2.5 h-2.5 mr-0.5" />
            DSA Project
          </Badge>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-500 text-gray-950 rounded-lg shadow-sm shadow-green-500/15 hover:bg-green-400 hover:shadow-md transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-800">
                {user?.username || "User"}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">
                {user?.role || "viewer"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-green-400 text-xs font-bold shadow-md">
              {(user?.username || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-gray-950" />
              </div>
              Software Usage Guide
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 p-4">
            {/* Quick Start Banner */}
            <div className="relative overflow-hidden p-3 bg-gray-950 rounded-lg text-white">
              <div className="relative z-10">
                <h3 className="font-bold text-xs mb-1 text-green-400">
                  🚀 Quick Start
                </h3>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  This is a Priority-Driven Pharmacy Management System
                  demonstrating Data Structures & Algorithms. Each page
                  showcases a different algorithm with practical applications.
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-green-500/20 rounded-full blur-xl" />
              <div className="absolute -right-3 -top-3 w-12 h-12 bg-green-500/20 rounded-full blur-lg" />
            </div>

            {/* Feature Cards */}
            <div className="grid gap-3">
              {helpSections.map((section, index) => (
                <div
                  key={index}
                  className="group p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-200 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-base shadow-sm flex-shrink-0`}
                    >
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-0.5">
                        {section.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mb-2">
                        {section.description}
                      </p>
                      <ul className="space-y-1">
                        {section.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-[11px] text-gray-600"
                          >
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="p-3 bg-gradient-to-br from-info-light to-secondary-light rounded-lg border border-info/20">
              <h3 className="font-semibold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="text-sm">💡</span>
                Tips & Features
              </h3>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <strong>Dashboard:</strong> See real-time stock alerts and
                  queue status
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <strong>Queue:</strong> Prescriptions automatically queued by
                  priority
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <strong>Dispense:</strong> FEFO ensures earliest-expiring
                  batches used first
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <strong>Inventory:</strong> Color-coded stock levels (Red:
                  Critical, Yellow: Low, Green: Normal)
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <strong>History:</strong> Bills track payments and immutable
                  records prevent tampering
                </li>
              </ul>
            </div>

            {/* Credentials */}
            <div className="p-5 bg-gradient-to-br from-warning-light to-amber-50 rounded-2xl border border-warning/20">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🔑</span>
                Login Credentials
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-warning/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    <span className="font-semibold text-slate-900">Admin</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-500">
                    <div>
                      Username:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        admin
                      </code>
                    </div>
                    <div>
                      Password:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        admin123
                      </code>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-warning/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-semibold text-slate-900">
                      Pharmacist
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-500">
                    <div>
                      Username:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        pharmacist
                      </code>
                    </div>
                    <div>
                      Password:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        pharma123
                      </code>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-warning/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-semibold text-slate-900">Viewer</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-500">
                    <div>
                      Username:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        viewer
                      </code>
                    </div>
                    <div>
                      Password:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        view123
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Topbar;
