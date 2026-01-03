import React from "react";

export const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled,
      loading,
      className = "",
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

    const variants = {
      primary:
        "bg-green-500 text-gray-950 shadow-sm shadow-green-500/15 hover:bg-green-400 hover:shadow-md focus:ring-green-500/40",
      secondary:
        "bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:shadow-md focus:ring-gray-500/40",
      success:
        "bg-green-500 text-gray-950 shadow-sm shadow-green-500/15 hover:bg-green-400 hover:shadow-md focus:ring-green-500/40",
      warning:
        "bg-amber-500 text-gray-950 shadow-sm shadow-amber-500/15 hover:bg-amber-400 hover:shadow-md focus:ring-amber-500/40",
      danger:
        "bg-red-500 text-white shadow-sm shadow-red-500/15 hover:bg-red-400 hover:shadow-md focus:ring-red-500/40",
      outline:
        "border border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
      ghost:
        "text-gray-600 hover:bg-gray-100/80 hover:text-gray-800 focus:ring-gray-200",
      soft: "bg-green-100/80 text-green-700 hover:bg-green-200/80 focus:ring-green-300",
    };

    const sizes = {
      xs: "px-2 py-1 text-[11px] gap-1",
      sm: "px-2.5 py-1.5 text-xs gap-1.5",
      md: "px-3.5 py-2 text-xs gap-1.5",
      lg: "px-4 py-2.5 text-sm gap-2",
      xl: "px-6 py-3 text-sm gap-2",
    };

    const iconSizes = {
      xs: "w-3 h-3",
      sm: "w-3.5 h-3.5",
      md: "w-3.5 h-3.5",
      lg: "w-4 h-4",
      xl: "w-5 h-5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {Icon && iconPosition === "left" && !loading && (
          <Icon className={iconSizes[size]} />
        )}
        {children}
        {Icon && iconPosition === "right" && !loading && (
          <Icon className={iconSizes[size]} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
