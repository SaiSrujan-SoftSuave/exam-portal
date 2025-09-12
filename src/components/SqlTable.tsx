import React from 'react';

interface SqlTableProps {
  tableName: string;
  headers: string[];
  rows: string[][];
  className?: string;
}

export const SqlTable: React.FC<SqlTableProps> = ({ tableName, headers, rows, className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h4 className="font-mono font-bold text-gray-800 mb-3">{tableName}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 font-mono text-sm">
          <thead>
            <tr className="bg-gray-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-400 px-3 py-2 text-left font-bold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-400 px-3 py-2"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};