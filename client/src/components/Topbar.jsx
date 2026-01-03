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
      description:
        "Overview of your pharmacy operations with key metrics and quick actions.",
      features: [
        "View total medicines, batches, and patients",
        "Quick statistics at a glance",
        "Recent activity tracking",
      ],
    },
    {
      title: "Inventory Management",
      icon: "💊",
      color: "from-emerald-500 to-teal-500",
      description:
        "Manage medicine stock using Hash Table for O(1) lookup speed.",
      features: [
        "Search medicines by code (e.g., MED001) for instant results",
        "Add/Edit medicine details",
        "View stock levels with color-coded alerts",
        "Hash Table visualization shows data structure in action",
      ],
    },
    {
      title: "Queue System",
      icon: "👥",
      color: "from-amber-500 to-orange-500",
      description: "Priority-based patient queue using Min-Heap algorithm.",
      features: [
        "Automatic priority ordering (Emergency → High → Normal → Low)",
        "Add patients to queue",
        "Process highest priority patient first",
        "Min-Heap tree visualization shows algorithm structure",
      ],
    },
    {
      title: "Dispense Medicine",
      icon: "🏥",
      color: "from-rose-500 to-pink-500",
      description:
        "FEFO (First-Expiry-First-Out) allocation using Greedy algorithm.",
      features: [
        "Search prescriptions by ID",
        "Automatic batch allocation from earliest expiry",
        "View step-by-step greedy algorithm choices",
        "Minimize medicine wastage through smart allocation",
      ],
    },
    {
      title: "Audit History",
      icon: "🔒",
      color: "from-purple-500 to-violet-500",
      description:
        "Immutable audit trail using Append-Only Log with hash chain.",
      features: [
        "View all system activities",
        "Tamper-evident hash chain (like blockchain)",
        "Filter by action type or search",
        "Verify chain integrity",
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

            {/* DSA Tips */}
            <div className="p-3 bg-gradient-to-br from-info-light to-secondary-light rounded-lg border border-info/20">
              <h3 className="font-semibold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                <span className="text-sm">💡</span>
                DSA Visualization Tips
              </h3>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  Click "View Algorithm" buttons to see data structures in
                  action
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  Hash Table: Type medicine codes starting with "MED" for
                  instant O(1) lookup
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  Min-Heap: Add patients or process queue to see heap
                  reorganization
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  FEFO: Search prescriptions to see greedy batch allocation
                  step-by-step
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  Audit Log: Add entries to see the immutable hash chain grow
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
