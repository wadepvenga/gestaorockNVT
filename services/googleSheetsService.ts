import type { SheetInfo, ValueRange, ProcessedSheetData, FinancialRecord } from '../types';
import { GOOGLE_SHEETS_API_KEY, SPREADSHEET_ID, DATA_START_ROW, HEADER_ROW, DATA_START_COLUMN, MAX_DATA_COLUMN } from '../constants';

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

async function fetchFromApi<T,>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${SPREADSHEET_ID}${endpoint}?key=${GOOGLE_SHEETS_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: `HTTP error ${response.status} with no JSON body` } })); 
      const errorMessage = errorData?.error?.message || `HTTP error ${response.status}`;
      console.error(`API Error: ${errorMessage}`, errorData);
      throw new Error(`Failed to fetch from Google Sheets API: ${errorMessage}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Network or other error in fetchFromApi:", error);
    if (error instanceof Error) {
        throw error; // Re-throw if already an Error object
    }
    throw new Error(String(error)); // Ensure it's an Error object
  }
}

export async function getSheetYears(): Promise<string[]> {
  const data = await fetchFromApi<SheetInfo>(''); // Endpoint is just '' for spreadsheet-level info
  if (data && data.sheets) { // Correctly access the top-level 'sheets' array
    return data.sheets.map(sheet => sheet.properties.title).sort((a,b) => b.localeCompare(a)); // Sort descending
  }
  console.warn("No sheets found in spreadsheet data or data structure unexpected:", data);
  return [];
}

export async function getSheetData(year: string): Promise<ProcessedSheetData> {
  // Fetch from A6 (HEADER_ROW) to include all headers and data up to a reasonable limit.
  const mainDataRange = `${year}!A${HEADER_ROW}:${MAX_DATA_COLUMN}${DATA_START_ROW + 100}`; 
  const profitabilityCellRange = `${year}!K1`;

  const [mainDataResponse, profitabilityResponse] = await Promise.all([
    fetchFromApi<ValueRange>(`/values/${encodeURIComponent(mainDataRange)}`),
    fetchFromApi<ValueRange>(`/values/${encodeURIComponent(profitabilityCellRange)}`)
  ]);
  
  if (!mainDataResponse.values || mainDataResponse.values.length === 0) {
    console.warn(`No values returned for range ${mainDataRange}`);
    return { year, columnHeaders: [], indicatorRows: [], annualProfitability: undefined };
  }

  const rawValues = mainDataResponse.values;
  // rawValues[0] corresponds to HEADER_ROW (e.g., sheet row 6)
  const headerRowFromSheet = rawValues[0]; 
  
  // Extract column headers (e.g., Jan/2025, Feb/2025), skipping the first cell (Indicator Name placeholder like "FINANCEIRO")
  const columnHeaders = headerRowFromSheet.slice(1).filter(header => header && String(header).trim() !== ''); 

  const indicatorRows: FinancialRecord[] = [];
  // Process all rows fetched, including the header row itself if it's meant to be data (e.g. "FINANCEIRO" as a sub-header in table)
  // and actual data indicator rows which start from rawValues[1] (sheet row 7 onwards).
  for (let i = 0; i < rawValues.length; i++) {
    const fullRowDataFromSheet = rawValues[i]; // This is an array representing a row from the sheet
    const indicatorName = String(fullRowDataFromSheet[0]).trim(); 
    
    // Skip if indicator name in the first column is empty after trimming
    if (!indicatorName) {
      continue; 
    }

    const currentIndicatorValues: (string | number)[] = [];
    // Ensure the 'values' array for each indicator has the same length as 'columnHeaders'
    for (let j = 0; j < columnHeaders.length; j++) {
      // fullRowDataFromSheet[0] is the indicator name (Column A)
      // fullRowDataFromSheet[j + 1] corresponds to data columns (B, C, ...) aligned with columnHeaders
      const val = fullRowDataFromSheet[j + 1]; 
      const sVal = String(val); // Ensure val is treated as a string for trim
      currentIndicatorValues.push((val === undefined || val === null || sVal.trim() === '') ? '-' : sVal.trim());
    }
    
    indicatorRows.push({
      indicatorName: indicatorName,
      values: currentIndicatorValues, // This array is now guaranteed to be columnHeaders.length long
    });
  }

  let annualProfitability: string | undefined = undefined;
  if (profitabilityResponse.values && profitabilityResponse.values.length > 0 && profitabilityResponse.values[0].length > 0) {
    const profitabilityValue = profitabilityResponse.values[0][0];
    if (profitabilityValue !== null && profitabilityValue !== undefined && String(profitabilityValue).trim() !== '') {
      annualProfitability = String(profitabilityValue).trim();
    }
  } else {
    console.warn(`No value returned for profitability cell ${profitabilityCellRange}`);
  }

  return { year, columnHeaders, indicatorRows, annualProfitability };
}