import React from "react";

export const Input = React.forwardRef(
  ({ label, error, helper, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-xs font-medium text-gray-600">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
          w-full px-2.5 py-1.5 
          border rounded-md text-sm 
          text-gray-800 placeholder:text-gray-400
          bg-white/80
          focus:outline-none focus:ring-1 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:ring-green-400 focus:border-green-400"
          }
          ${className}
        `}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        {helper && !error && (
          <p className="text-[10px] text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
