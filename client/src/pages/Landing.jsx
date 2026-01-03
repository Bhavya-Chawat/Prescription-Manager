import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  Activity,
  ClipboardList,
  Users,
  Shield,
  TrendingUp,
} from "lucide-react";
import Button from "../components/ui/Button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Pill className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900">
                Pharmacy Manager
              </span>
            </div>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Priority-Driven Pharmacy Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your pharmacy operations with intelligent prioritization,
            automated dispensing, and comprehensive audit trails. Built with
            advanced algorithms for optimal efficiency.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Pharmacies
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your pharmacy efficiently and safely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-primary-600" />}
              title="Priority Queue Management"
              description="Min-Heap algorithm ensures urgent prescriptions are processed first. Emergency cases get immediate attention while maintaining fair service."
            />
            <FeatureCard
              icon={<Pill className="h-8 w-8 text-primary-600" />}
              title="Smart Inventory Control"
              description="Real-time stock tracking with automated low-stock alerts. Hash table-based lookups for instant medicine availability checks."
            />
            <FeatureCard
              icon={<ClipboardList className="h-8 w-8 text-primary-600" />}
              title="Intelligent Dispensing"
              description="FEFO (First Expiry, First Out) greedy algorithm minimizes waste by automatically selecting batches closest to expiration."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Patient Management"
              description="Comprehensive patient profiles with prescription history, allergies, and special requirements for safe medication dispensing."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Complete Audit Trail"
              description="Append-only logs track every action with timestamps and user attribution. Full compliance with pharmacy regulations."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary-600" />}
              title="Analytics Dashboard"
              description="Real-time insights into operations, stock levels, revenue trends, and performance metrics for data-driven decisions."
            />
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built on Advanced Data Structures
            </h2>
            <p className="text-lg text-gray-600">
              Production-grade algorithms for optimal performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AlgorithmCard
              title="Hash Tables"
              description="O(1) average-case lookup for medicine inventory by code or name. Instant availability checks even with thousands of products."
            />
            <AlgorithmCard
              title="Priority Queues (Min-Heap)"
              description="O(log n) insertion and extraction. Ensures patients with highest priority (emergency cases) are always served first."
            />
            <AlgorithmCard
              title="Linked Lists"
              description="Dynamic prescription items without reallocation overhead. Efficient insertion and deletion during order modifications."
            />
            <AlgorithmCard
              title="Greedy Algorithms (FEFO)"
              description="Optimal batch allocation by expiry date. Minimizes medicine waste while maintaining safety standards."
            />
            <AlgorithmCard
              title="FIFO Queues"
              description="Fair processing order for same-priority prescriptions. Maintains service equity across all patients."
            />
            <AlgorithmCard
              title="Append-Only Logs"
              description="Immutable audit trail ensures data integrity. Every action is permanently recorded for compliance and accountability."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-xl text-primary-50 mb-8">
            Join modern pharmacies using intelligent systems to improve patient
            care and operational efficiency.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/login")}
          >
            Sign In to Dashboard
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            &copy; 2025 Pharmacy Manager. Built with React, Node.js, and
            MongoDB.
          </p>
          <p className="mt-2 text-sm">
            Demonstrating Data Structures & Algorithms in Production
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function AlgorithmCard({ title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
