
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { SummaryKPIs } from './components/SummaryKPIs';
import { FinancialTable } from './components/FinancialTable';
import { Spinner } from './components/Spinner';
import { ErrorMessage } from './components/ErrorMessage';
import { LoginPage } from './components/LoginPage'; // Import LoginPage
import { getSheetYears, getSheetData } from './services/googleSheetsService';
import type { ProcessedSheetData, KPICard, KPICardConfig } from './types';
import { MONTH_NAMES_PT, SHORT_MONTH_NAMES_PT, KPI_INDICATOR_MAPPING, KPI_CONFIGS } from './constants';
import { formatCurrency, formatPercentage } from './utils/formatting';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 

  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonthName, setSelectedMonthName] = useState<string>(MONTH_NAMES_PT[0]); 
  
  const [financialData, setFinancialData] = useState<ProcessedSheetData | null>(null);
  const [kpiCards, setKpiCards] = useState<KPICard[]>([]);
  
  const [loadingYears, setLoadingYears] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [initialMonthLogicAppliedForYear, setInitialMonthLogicAppliedForYear] = useState<string | null>(null);


  useEffect(() => {
    if (!isAuthenticated) {
      setYears([]);
      setSelectedYear(null);
      setFinancialData(null);
      setKpiCards([]);
      setError(null);
      setInitialMonthLogicAppliedForYear(null); 
      return;
    }

    const fetchYears = async () => {
      try {
        setLoadingYears(true);
        setError(null);
        setInitialMonthLogicAppliedForYear(null); 
        
        const fetchedYears = await getSheetYears();
        setYears(fetchedYears);
        if (fetchedYears.length > 0) {
          const currentYear = new Date().getFullYear().toString();
          if (fetchedYears.includes(currentYear)) {
            setSelectedYear(currentYear);
          } else {
            setSelectedYear(fetchedYears[fetchedYears.length -1]); 
          }
        } else {
          setError("Nenhum ano (aba) encontrado na planilha. Verifique se a planilha contém abas nomeadas como anos e se as configurações da API Key (Google Cloud) e da planilha (compartilhamento 'Qualquer pessoa com o link pode ver') estão corretas. Detalhes técnicos podem estar no console do navegador.");
        }
      } catch (err) {
        console.error("Error fetching years:", err);
        const specificMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar anos.";
        setError(`Falha ao buscar os anos da planilha. Verifique a chave da API, o ID da planilha e as configurações de compartilhamento. Erro: ${specificMessage}. Consulte o console do navegador para mais detalhes técnicos.`);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, [isAuthenticated]); 

  useEffect(() => {
    if (!isAuthenticated || !selectedYear) return; 

    const fetchDataForYear = async () => {
      try {
        setLoadingData(true);
        setError(null); 
        setFinancialData(null); 
        const data = await getSheetData(selectedYear);
        setFinancialData(data);
         if (data.indicatorRows.length === 0 && data.columnHeaders.length === 0) {
           if(!error || !error.includes("Nenhum ano (aba) encontrado")){
             setError(`Nenhum dado encontrado para o ano ${selectedYear} na planilha. Verifique se a aba do ano contém dados.`);
           }
        }
      } catch (err) {
        console.error(`Error fetching data for year ${selectedYear}:`, err);
        const specificMessage = err instanceof Error ? err.message : `Erro desconhecido ao buscar dados para ${selectedYear}.`;
        setError(`Falha ao buscar dados para o ano ${selectedYear}. Erro: ${specificMessage}. Verifique o console.`);
      } finally {
        setLoadingData(false);
      }
    };
    fetchDataForYear();
  }, [selectedYear, isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated || !financialData || initialMonthLogicAppliedForYear === selectedYear || !selectedYear) {
      return;
    }
  
    const keyIndicatorName = KPI_INDICATOR_MAPPING["Custo por Aluno"].toUpperCase(); 
  
    const keyIndicator = financialData.indicatorRows.find(
      row => row.indicatorName.toUpperCase() === keyIndicatorName
    );
  
    if (keyIndicator && keyIndicator.values.length > 0 && financialData.columnHeaders.length > 0) {
      let bestMonthIndex = -1;
  
      for (let i = financialData.columnHeaders.length - 1; i >= 0; i--) {
        const monthHeader = financialData.columnHeaders[i];
        
        if (monthHeader.toUpperCase().includes("TOTAL") || monthHeader.toUpperCase().includes("MÉDIA") || monthHeader.toUpperCase().includes("MEDIA")) {
          continue;
        }
  
        const valueForMonth = keyIndicator.values[i];
        const hasData = valueForMonth !== '-';

        if (hasData) {
          bestMonthIndex = i;
          break; 
        }
      }
  
      if (bestMonthIndex !== -1) {
        // The sheet headers (e.g. "Apr/2025") use English short names.
        // SHORT_MONTH_NAMES_PT has been updated to English short names.
        const bestMonthShortNameFromSheet = financialData.columnHeaders[bestMonthIndex].substring(0, 3).toLowerCase();
        const fullMonthIndex = SHORT_MONTH_NAMES_PT.findIndex(
          // SHORT_MONTH_NAMES_PT now contains "Jan", "Feb", "Mar", "Apr", etc.
          shortName => shortName.toLowerCase() === bestMonthShortNameFromSheet
        );

        if (fullMonthIndex !== -1) {
          setSelectedMonthName(MONTH_NAMES_PT[fullMonthIndex]);
        } else {
          // Fallback or warning if mapping failed (should be rare with correct constants)
           setSelectedMonthName(MONTH_NAMES_PT[0]); // Default to January
        }
      } else {
        setSelectedMonthName(MONTH_NAMES_PT[0]);
      }
    } else {
      setSelectedMonthName(MONTH_NAMES_PT[0]);
    }
    setInitialMonthLogicAppliedForYear(selectedYear);
  }, [financialData, selectedYear, isAuthenticated, initialMonthLogicAppliedForYear]);
  

  useEffect(() => {
    if (!financialData || !selectedMonthName) {
      setKpiCards([]);
      return;
    }

    let dataColumnIndex = -1;
    const monthIndex = MONTH_NAMES_PT.indexOf(selectedMonthName);
    let shortMonth = ''; // This will be "jan", "feb", "apr" etc. from the updated SHORT_MONTH_NAMES_PT
    if (monthIndex !== -1) {
      shortMonth = SHORT_MONTH_NAMES_PT[monthIndex].toLowerCase();
    }

    if (shortMonth && financialData.columnHeaders) {
      for (let i = 0; i < financialData.columnHeaders.length; i++) {
        const currentSheetHeader = financialData.columnHeaders[i]; // e.g., "Apr/2025"
        const processedSheetHeader = currentSheetHeader.toLowerCase().trim();
        
        const headerAbbreviation = processedSheetHeader.substring(0, 3); // e.g., "apr"
        
        if (headerAbbreviation === shortMonth) {
          if (!processedSheetHeader.includes("total") && !processedSheetHeader.includes("média") && !processedSheetHeader.includes("media")) {
            dataColumnIndex = i;
            break; 
          }
        }
      }
    }
    
    const newKpiCards = Object.keys(KPI_INDICATOR_MAPPING).map((cardLabel) => {
      const sheetIndicatorName = KPI_INDICATOR_MAPPING[cardLabel];
      const config = KPI_CONFIGS[cardLabel] || { color: 'bg-gray-500' }; 

      let rawValue: string | number = '-'; 

      const indicatorRow = financialData.indicatorRows.find(
        (row) => row.indicatorName.toUpperCase().trim() === sheetIndicatorName.toUpperCase().trim()
      );
      
      if (dataColumnIndex !== -1 && indicatorRow && indicatorRow.values.length > dataColumnIndex) {
        rawValue = indicatorRow.values[dataColumnIndex];
      }
      
      let displayValue: string | number = rawValue;
      if (rawValue !== '-') {
        if (config.isCurrency) {
          displayValue = formatCurrency(rawValue);
        } else if (config.isPercentage) {
          const numericValue = typeof rawValue === 'string' ? parseFloat(rawValue.replace('%', '')) : rawValue;
          if (!isNaN(numericValue as number)) {
            displayValue = formatPercentage(numericValue as number);
          } else {
            displayValue = rawValue; 
          }
        }
      }

      return {
        label: cardLabel,
        value: displayValue,
        icon: config.icon,
        color: config.color,
      };
    });
    setKpiCards(newKpiCards);
  }, [financialData, selectedMonthName, isAuthenticated]);


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
    setInitialMonthLogicAppliedForYear(null); 
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonthName(month);
  }, []);


  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderNav
        title="Painel de Gestão Financeira - Rock Navegantes"
        years={years}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        months={MONTH_NAMES_PT}
        selectedMonth={selectedMonthName}
        onMonthChange={handleMonthChange}
        isLoadingYears={loadingYears}
        isLoadingData={loadingData} 
        annualProfitability={financialData?.annualProfitability} 
      />
      <main className="container mx-auto p-4">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        
        {loadingYears && !selectedYear && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" /> 
            <p className="ml-4 text-lg text-gray-600">Carregando anos...</p>
          </div>
        )}

        <SummaryKPIs kpis={kpiCards} isLoading={loadingData && kpiCards.length === 0 || (!financialData && !error && !loadingYears)} />
        
        {selectedYear && financialData && !loadingData && financialData.indicatorRows.length > 0 && (
          <FinancialTable year={selectedYear} data={financialData} />
        )}

        {selectedYear && !loadingData && (!financialData || financialData.indicatorRows.length === 0) && !error && (
           <div className="text-center py-10 text-gray-500">
            Nenhum dado financeiro detalhado para exibir para {selectedMonthName} de {selectedYear}.
          </div>
        )}
      </main>
    </div>
  );
};

export default App;