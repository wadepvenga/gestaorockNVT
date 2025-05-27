
import React from 'react';
import { SummaryCard } from './SummaryCard';
import type { KPICard } from '../types';
// Spinner not used here directly anymore, but good to keep if layouts change
// import { Spinner } from './Spinner';


interface SummaryKPIsProps {
  kpis: KPICard[];
  isLoading?: boolean;
}

export const SummaryKPIs: React.FC<SummaryKPIsProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Resumo Financeiro</h2>
        <div className="max-w-7xl mx-auto"> {/* Constrain and center skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => ( // Updated to 10 for new KPI
              <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center h-32 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!kpis || kpis.length === 0) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Resumo Financeiro</h2>
            <div className="text-center py-6 text-gray-500 max-w-7xl mx-auto"> {/* Constrain and center message */}
                Nenhum KPI para exibir. Verifique a seleção de mês/ano ou os dados da planilha.
            </div>
        </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Resumo Financeiro</h2>
      
      <div className="max-w-7xl mx-auto"> 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.slice(0, 5).map((kpi) => (
            <SummaryCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>

      {kpis.length > 5 && (
         <div className="max-w-7xl mx-auto mt-4"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> {/* Changed to lg:grid-cols-5 */}
                {kpis.slice(5).map((kpi) => (
                  <SummaryCard key={kpi.label} {...kpi} />
                ))}
            </div>
         </div>
      )}
    </div>
  );
};
