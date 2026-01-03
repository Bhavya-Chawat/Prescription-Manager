import React from "react";

export const Select = React.forwardRef(
  ({ label, error, helper, options = [], className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
          w-full px-3 py-2 
          border rounded-md text-sm 
          text-text-primary
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-info-light disabled:text-text-disabled disabled:cursor-not-allowed
          ${
            error
              ? "border-error focus:ring-error"
              : "border-border-color focus:ring-primary"
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
        {error && <p className="text-xs text-error">{error}</p>}
        {helper && !error && (
          <p className="text-xs text-text-muted">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
