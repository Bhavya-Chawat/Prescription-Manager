import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { login } from "../services/authApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      console.log("Token found, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(formData);
      console.log("Login response:", response);
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid response format: missing token or user");
      }

      console.log("Setting auth with token:", token);
      setAuth(token, user);

      // Use a small timeout to ensure state is updated before navigation
      setTimeout(() => {
        console.log("Navigating to dashboard");
        navigate("/dashboard", { replace: true });
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || err.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-2xl">💊</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Pharmacy Management System
          </h1>
          <p className="text-sm text-gray-400">
            Priority-driven hospital pharmacy solution
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Demo Credentials:
              <br />
              Admin:{" "}
              <code className="text-gray-700 bg-gray-100 px-1 rounded">
                admin
              </code>{" "}
              /{" "}
              <code className="text-gray-700 bg-gray-100 px-1 rounded">
                admin123
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
