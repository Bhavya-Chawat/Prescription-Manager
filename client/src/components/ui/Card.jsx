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
        bg-[#FAFBFA] rounded-lg border border-gray-200/80 shadow-sm
        ${
          hover
            ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-green-200/60"
            : ""
        }
        ${gradient ? "bg-gradient-to-br from-[#FAFBFA] to-gray-50" : ""}
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
      px-4 py-3 border-b border-gray-100
      ${gradient ? "bg-gradient-to-r from-gray-50/80 to-white" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`px-4 py-3 border-t border-gray-100 bg-gray-50/30 rounded-b-lg ${className}`}
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
