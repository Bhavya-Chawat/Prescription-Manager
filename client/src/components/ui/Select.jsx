import React from "react";

export const Select = React.forwardRef(
  ({ label, error, helper, options = [], className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-xs font-medium text-gray-600">
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
          w-full px-2.5 py-1.5 
          border rounded-md text-sm 
          text-gray-800 bg-white/80
          focus:outline-none focus:ring-1 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:ring-green-400"
          }
          ${className}
        `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[10px] text-red-500">{error}</p>}
        {helper && !error && (
          <p className="text-[10px] text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
