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
      "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

    const variants = {
      primary:
        "bg-green-500 text-gray-950 shadow-md shadow-green-500/20 hover:bg-green-400 hover:shadow-lg focus:ring-green-500/50",
      secondary:
        "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg focus:ring-gray-500/50",
      success:
        "bg-green-500 text-gray-950 shadow-md shadow-green-500/20 hover:bg-green-400 hover:shadow-lg focus:ring-green-500/50",
      warning:
        "bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 hover:shadow-lg focus:ring-amber-500/50",
      danger:
        "bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-400 hover:shadow-lg focus:ring-red-500/50",
      outline:
        "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
      ghost:
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",
      soft: "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300",
    };

    const sizes = {
      xs: "px-2.5 py-1.5 text-xs gap-1.5",
      sm: "px-3.5 py-2 text-sm gap-2",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
      xl: "px-8 py-4 text-lg gap-3",
    };

    const iconSizes = {
      xs: "w-3.5 h-3.5",
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
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
