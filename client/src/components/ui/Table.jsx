import React from "react";

export const Table = ({ children, className = "" }) => {
  return (
    <div className="bg-[#FAFBFA] rounded-lg border border-gray-200/80 overflow-hidden">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-50/80 border-b border-gray-200/80">
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
};

export const TableRow = ({ children, onClick, className = "" }) => {
  return (
    <tr
      className={`hover:bg-gray-50/50 transition-colors ${
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
      className={`px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = "", colSpan }) => {
  return (
    <td
      className={`px-3 py-2 text-xs text-gray-700 ${className}`}
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
