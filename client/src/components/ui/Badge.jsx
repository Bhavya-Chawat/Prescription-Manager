import React from "react";

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
  dot = false,
}) => {
  const variants = {
    primary: "bg-green-100 text-green-700 border border-green-200",
    secondary: "bg-gray-100 text-gray-700 border border-gray-200",
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-amber-100 text-amber-700 border border-amber-200",
    error: "bg-red-100 text-red-700 border border-red-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-gray-100 text-gray-700 border border-gray-200",
    default: "bg-gray-100 text-gray-600 border border-gray-200",
    outline: "bg-transparent border-2 border-gray-300 text-gray-600",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success"
              ? "bg-green-500"
              : variant === "warning"
              ? "bg-amber-500"
              : variant === "error" || variant === "danger"
              ? "bg-red-500"
              : variant === "info"
              ? "bg-gray-500"
              : variant === "primary"
              ? "bg-green-500"
              : variant === "secondary"
              ? "bg-gray-500"
              : "bg-gray-400"
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
