import React from "react";

export function Label({ htmlFor, children, className = "", required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-text-primary mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

export default Label;
