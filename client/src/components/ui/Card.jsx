import React from "react";

export const Card = ({
  children,
  className = "",
  hover = false,
  gradient = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm
        ${
          hover
            ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-green-200"
            : ""
        }
        ${gradient ? "bg-gradient-to-br from-white to-gray-50" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", gradient = false }) => {
  return (
    <div
      className={`
      px-6 py-4 border-b border-gray-100
      ${gradient ? "bg-gradient-to-r from-gray-50 to-white" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl ${className}`}
    >
      {children}
    </div>
  );
};

// Attach subcomponents to Card for convenience (Card.Header, Card.Body, etc.)
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
