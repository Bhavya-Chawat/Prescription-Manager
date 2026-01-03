import React from "react";

export const Input = React.forwardRef(
  ({ label, error, helper, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
          w-full px-3 py-2 
          border rounded-md text-sm 
          text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-green-500 focus:border-green-500"
          }
          ${className}
        `}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
