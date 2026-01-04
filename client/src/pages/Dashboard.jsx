import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import {
  Package,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Pill,
  Stethoscope,
  BarChart3,
  Zap,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useAuthStore from "../store/authStore";
import { getDashboardStats } from "../services/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStock: 0,
    criticalStock: 0,
    inQueue: 0,
    todayRevenue: 0,
    todayBillCount: 0,
    queuePriorities: { emergency: 0, high: 0, normal: 0, low: 0 },
    stockDetails: { critical: 0, low: 0, healthy: 0 },
  });
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await getDashboardStats();
      const data = response.data?.data || {};
      setStats({
        totalStock: data.totalStock || 0,
        lowStock: data.lowStock || 0,
        criticalStock: data.criticalStock || 0,
        inQueue: data.inQueue || 0,
        todayRevenue: data.todayRevenue || 0,
        todayBillCount: data.todayBillCount || 0,
        queuePriorities: data.queuePriorities || {
          emergency: 0,
          high: 0,
          normal: 0,
          low: 0,
        },
        stockDetails: data.stockDetails || { critical: 0, low: 0, healthy: 0 },
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statsCards = [
    {
      title: "Total Stock Units",
      value: stats.totalStock.toLocaleString(),
      subtitle: "In inventory",
      icon: Package,
      trend: "Live",
      trendUp: true,
      gradient: "from-green-400 to-green-500",
      lightBg: "bg-green-50",
    },
    {
      title: "Low Stock Alert",
      value: `${stats.criticalStock}/${stats.lowStock}`,
      subtitle: "Critical / Low",
      icon: AlertTriangle,
      trend: "Attention",
      trendUp: false,
      gradient: "from-amber-400 to-amber-500",
      lightBg: "bg-amber-50",
    },
    {
      title: "Patients in Queue",
      value: stats.inQueue,
      subtitle: "Waiting now",
      icon: Users,
      trend: "Real-time",
      trendUp: true,
      gradient: "from-gray-800 to-gray-900",
      lightBg: "bg-gray-100",
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      subtitle: `${stats.todayBillCount} transactions`,
      icon: DollarSign,
      trend: "Today",
      trendUp: true,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gray-950 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👋</span>
            <Badge variant="primary" size="sm">
              {user?.role || "User"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-green-400">{user?.username || "User"}</span>!
          </h1>
          <p className="text-gray-400 max-w-xl">
            Here's what's happening in your pharmacy today. Monitor key metrics,
            manage queues, and explore DSA algorithms in action.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-green-400/10 rounded-full" />
        <Pill className="absolute right-12 top-12 w-16 h-16 text-green-500/20" />
        <Stethoscope className="absolute right-32 bottom-8 w-12 h-12 text-green-500/20" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} hover className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trendUp
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <Card className="lg:col-span-2">
          <CardHeader gradient>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Queue Status
                  </h3>
                  <p className="text-sm text-gray-500">
                    Patient priority distribution
                  </p>
                </div>
              </div>
              <Badge variant="warning" dot>
                {stats.inQueue} waiting
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Emergency",
                  count: stats.queuePriorities[0] || 0,
                  color: "bg-red-500",
                  lightColor: "bg-red-50",
                  textColor: "text-red-600",
                  percentage:
                    stats.inQueue > 0
                      ? ((stats.queuePriorities[0] || 0) / stats.inQueue) * 100
                      : 0,
                },
                {
                  label: "High Priority",
                  count: stats.queuePriorities[1] || 0,
                  color: "bg-amber-500",
                  lightColor: "bg-amber-50",
                  textColor: "text-amber-600",
                  percentage:
                    stats.inQueue > 0
                      ? ((stats.queuePriorities[1] || 0) / stats.inQueue) * 100
                      : 0,
                },
                {
                  label: "Normal",
                  count: stats.queuePriorities[2] || 0,
                  color: "bg-green-500",
                  lightColor: "bg-green-50",
                  textColor: "text-green-600",
                  percentage:
                    stats.inQueue > 0
                      ? ((stats.queuePriorities[2] || 0) / stats.inQueue) * 100
                      : 0,
                },
                {
                  label: "Low Priority",
                  count: stats.queuePriorities[3] || 0,
                  color: "bg-gray-400",
                  lightColor: "bg-gray-100",
                  textColor: "text-gray-600",
                  percentage:
                    stats.inQueue > 0
                      ? ((stats.queuePriorities[3] || 0) / stats.inQueue) * 100
                      : 0,
                },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <Badge
                      variant={
                        i === 0
                          ? "error"
                          : i === 1
                          ? "warning"
                          : i === 2
                          ? "primary"
                          : "default"
                      }
                      size="sm"
                    >
                      {item.count} patients
                    </Badge>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DSA Modules */}
        <Card>
          <CardHeader gradient>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-gray-950" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  DSA Modules
                </h3>
                <p className="text-sm text-gray-500">Algorithm status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: "Hash Table",
                  page: "Inventory",
                  status: "Active",
                  color: "success",
                },
                {
                  name: "Min-Heap",
                  page: "Queue",
                  status: "Active",
                  color: "success",
                },
                {
                  name: "Greedy FEFO",
                  page: "Dispense",
                  status: "Active",
                  color: "success",
                },
                {
                  name: "Hash Chain",
                  page: "History",
                  status: "Active",
                  color: "success",
                },
              ].map((module, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {module.name}
                    </p>
                    <p className="text-xs text-gray-500">{module.page}</p>
                  </div>
                  <Badge variant={module.color} size="xs" dot>
                    {module.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader gradient>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-500">
                  Common pharmacy operations
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/prescriptions"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all"
            >
              <Stethoscope className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">
                New Prescription
              </span>
            </Link>
            <Link
              to="/queue"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all"
            >
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">
                View Queue
              </span>
            </Link>
            <Link
              to="/inventory"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all"
            >
              <Package className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">
                Manage Inventory
              </span>
            </Link>
            <Link
              to="/history"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all"
            >
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">
                View History
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
