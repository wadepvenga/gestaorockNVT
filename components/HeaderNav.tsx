import React from 'react';

interface HeaderNavProps {
  title: string;
  years: string[];
  selectedYear: string | null;
  onYearChange: (year: string) => void;
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isLoadingYears?: boolean;
  isLoadingData?: boolean; // To show loading for profitability
  annualProfitability?: string; // The value from K1
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  years,
  selectedYear,
  onYearChange,
  months,
  selectedMonth,
  onMonthChange,
  isLoadingYears,
  isLoadingData,
  annualProfitability,
}) => {
  return (
    <header className="bg-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0 md:mr-4 whitespace-nowrap">{title}</h1>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"> {/* Increased space-x for better separation */}
          {/* Profitability Display - Now directly on the blue header */}
          <div className="order-first sm:order-none my-2 sm:my-0 text-base"> {/* Changed text-sm to text-base */}
            {selectedYear && ( // Only show profitability section if a year is selected
              <>
                <span className="font-medium">Lucratividade Anual: </span>
                {isLoadingData && !annualProfitability && (
                  <span className="animate-pulse font-semibold">Carregando...</span>
                )}
                {annualProfitability && (
                  <span className="font-bold">{annualProfitability}</span>
                )}
                {!isLoadingData && !annualProfitability && ( // No data after loading for the selected year
                  <span className="font-bold">-</span>
                )}
              </>
            )}
          </div>

          {/* Month/Year Selectors */}
          {(years && years.length > 0 || isLoadingYears) && ( // Only show selectors if there are years or years are loading
            <>
              <div className="flex items-center space-x-2">
                <label htmlFor="month-select" className="text-sm">Mês:</label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                  disabled={isLoadingYears || years.length === 0 || isLoadingData}
                  className="bg-blue-600 border border-blue-500 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="year-select" className="text-sm">Ano:</label>
                <select
                  id="year-select"
                  value={selectedYear || ''}
                  onChange={(e) => onYearChange(e.target.value)}
                  disabled={isLoadingYears || years.length === 0 || isLoadingData}
                  className="bg-blue-600 border border-blue-500 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
                >
                  {isLoadingYears && <option value="">Carregando...</option>}
                  {!isLoadingYears && years.length === 0 && <option value="">N/A</option>}
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};