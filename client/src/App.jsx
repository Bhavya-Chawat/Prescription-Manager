import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import Prescriptions from "./pages/Prescriptions.jsx";
import Queue from "./pages/Queue.jsx";
import Dispense from "./pages/Dispense.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Layout from "./components/Layout.jsx";

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
}

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/dispense" element={<Dispense />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
