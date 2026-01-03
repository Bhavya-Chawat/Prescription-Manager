import React from "react";

export const Table = ({ children, className = "" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  );
};

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
};

export const TableRow = ({ children, onClick, className = "" }) => {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = "" }) => {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = "", colSpan }) => {
  return (
    <td
      className={`px-4 py-3 text-sm text-gray-900 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

// Attach subcomponents to Table for convenience (Table.Header, Table.Body, etc.)
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
