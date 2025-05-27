import React from 'react';
import type { ProcessedSheetData } from '../types';

interface FinancialTableProps {
  year: string;
  data: ProcessedSheetData;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ year, data }) => {
  if (!data || data.indicatorRows.length === 0) {
    return <div className="text-center py-10 text-gray-500">Nenhum dado disponível para a tabela.</div>;
  }

  // Identify which columns are purely numeric for text alignment
  // This check is based on the content of data cells, not sub-header cells.
  const isNumericColumn = (columnIndex: number): boolean => {
    for (let i = 0; i < data.indicatorRows.length; i++) {
      // Skip sub-header rows for determining column numeric type
      const currentIndicatorName = data.indicatorRows[i].indicatorName.toUpperCase();
      if (currentIndicatorName === 'FINANCEIRO' || currentIndicatorName === 'KPI ALUNOS') {
        continue;
      }
      
      const value = data.indicatorRows[i].values[columnIndex];
      if (typeof value === 'string') {
        if (value.startsWith('R$') || value.includes('%') || !isNaN(parseFloat(value.replace('.', '').replace(',', '.')))) {
          return true;
        }
      } else if (typeof value === 'number') {
        return true;
      }
      // Check a few data rows (e.g., up to 5 actual data rows)
      if (i >= 5 && (currentIndicatorName !== 'FINANCEIRO' && currentIndicatorName !== 'KPI ALUNOS')) { // Heuristic: check first few data rows
          break;
      }
    }
    return false; 
  };


  return (
    <div className="bg-white shadow-xl rounded-lg p-2 sm:p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2 pt-2">Dados Financeiros - {year}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 min-w-[200px] md:min-w-[250px]">
              Indicador
            </th>
            {data.columnHeaders.map((header, index) => (
              <th key={index} scope="col" className={`px-4 py-3 text-${isNumericColumn(index) ? 'right' : 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.indicatorRows.map((row, rowIndex) => {
            const indicatorNameUpper = row.indicatorName.toUpperCase();
            const isSubHeaderRow = indicatorNameUpper === 'FINANCEIRO' || indicatorNameUpper === 'KPI ALUNOS';

            const trClasses = isSubHeaderRow 
              ? 'bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors' 
              : `${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`;

            const stickyTdClasses = `px-4 py-3 whitespace-nowrap text-sm font-medium sticky left-0 bg-inherit z-10 min-w-[200px] md:min-w-[250px] ${isSubHeaderRow ? '' : 'text-gray-800'}`;
            // For sub-header rows, text color and font weight are inherited from trClasses.
            // For normal rows, specific text color is applied.

            return (
              <tr key={rowIndex} className={trClasses}>
                <td className={stickyTdClasses}>
                  {row.indicatorName}
                </td>
                {row.values.map((value, valueIndex) => {
                  const valueCellAlignment = isSubHeaderRow ? 'text-left' : (isNumericColumn(valueIndex) ? 'text-right' : 'text-left');
                  const valueTdClasses = `px-4 py-3 whitespace-nowrap text-sm ${valueCellAlignment} ${isSubHeaderRow ? '' : 'text-gray-600'}`;
                  // For sub-header rows, text color and font weight inherited from trClasses.
                  // For normal rows, specific text color is applied.
                  return (
                    <td key={valueIndex} className={valueTdClasses}>
                      {typeof value === 'number' ? value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};