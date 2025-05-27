import React from 'react';

// Raw response from Google Sheets API for spreadsheet metadata
export interface SheetInfo {
  spreadsheetId: string;
  properties: { // Top-level properties of the spreadsheet
    title: string; // The overall title of the spreadsheet file
    locale?: string;
    autoRecalc?: string;
    timeZone?: string;
    defaultFormat?: object;
    spreadsheetTheme?: object;
    // ... other spreadsheet properties
  };
  sheets: Array<{ // Array of sheet objects
    properties: { // Properties of an individual sheet (tab)
      sheetId: number;
      title: string; // This is the sheet name (e.g., "2023", "2024")
      index: number;
      sheetType?: string;
      gridProperties?: object;
      hidden?: boolean;
      tabColor?: object;
      rightToLeft?: boolean;
      // ... other sheet properties
    };
  }>;
  spreadsheetUrl?: string;
  developerMetadata?: any[];
  namedRanges?: any[];
  protectedRanges?: any[];
}


// Raw response from Google Sheets API for a value range
export interface ValueRange {
  range: string;
  majorDimension: string;
  values: string[][];
}

// Processed data structure for a financial record (one row in the table)
export interface FinancialRecord {
  indicatorName: string;
  values: (string | number)[]; // Values corresponding to each columnHeader
}

// Processed data for an entire sheet (year)
export interface ProcessedSheetData {
  year: string;
  columnHeaders: string[]; // e.g., ["Jan/2025", "Fev/2025", ..., "TOTAL MÉDIAS"]
  indicatorRows: FinancialRecord[];
  annualProfitability?: string; // Added to store value from cell K1
}

// Structure for a KPI card
export interface KPICard {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string; // Tailwind CSS background color class
  isCurrency?: boolean;
  isPercentage?: boolean;
}

// Config for styling KPI cards
export interface KPICardConfig {
  icon?: React.ReactNode;
  color: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
}