
import type { KPICardConfig } from './types';
import { Icons } from './components/icons'; // Assuming icons.tsx exists

// !!! IMPORTANT: API keys should ideally be stored in environment variables and not hardcoded.
// This is directly from the user prompt.
export const GOOGLE_SHEETS_API_KEY = "AIzaSyDXMSnzWko3pVk4VTV2OYKY2HYN89dM130";
export const SPREADSHEET_ID = "1zQCs7Hz7TM_LfhZ8aQMzmzI2PHrFvEcUgxVo5fAhY2A";

export const MONTH_NAMES_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Updated to English abbreviations to match sheet headers
export const SHORT_MONTH_NAMES_PT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Row numbers are 1-indexed as in Google Sheets
export const HEADER_ROW = 6; 
export const DATA_START_ROW = 7;

// Column letters
export const INDICATOR_NAME_COLUMN = 'A';
export const DATA_START_COLUMN = 'B';
export const MAX_DATA_COLUMN = 'P'; // Fetch up to column P to include potential totals

// Mapping from desired card label to the exact indicator name in Google Sheet (Column A)
// Order here dictates the order in SummaryKPIs
export const KPI_INDICATOR_MAPPING: Record<string, string> = {
  "Faturamento": "FATURAMENTO (contas a receber)",
  "Despesas": "DESPESAS:",
  "Lucro Total": "LUCRO TOTAL", 
  "Alunos Ativos": "ALUNOS PAGANTES", 
  "% Meta Atingida": "% META ATINGIDA",
  "Ticket Médio": "TICKET MÉDIO",
  "Parcela Média": "PARCELA MÉDIA",
  "Lucro por Aluno": "LUCRO POR ALUNO",
  "Custo por Aluno": "CUSTO POR ALUNO",   // New KPI
  "Custo por Turma": "CUSTO POR TURMA", // Existing, "Custo por Aluno" is now "ao lado"
};

// Configuration for KPI cards (icons, colors)
// Match keys and order with KPI_INDICATOR_MAPPING for clarity
export const KPI_CONFIGS: Record<string, KPICardConfig> = {
  "Faturamento": { icon: Icons.CurrencyDollar, color: 'bg-blue-500', isCurrency: true },
  "Despesas": { icon: Icons.ArrowTrendingDown, color: 'bg-red-500', isCurrency: true },
  "Lucro Total": { icon: Icons.ChartBar, color: 'bg-orange-500', isCurrency: true }, 
  "Alunos Ativos": { icon: Icons.Users, color: 'bg-green-500' }, 
  "% Meta Atingida": { icon: Icons.CheckCircle, color: 'bg-purple-500', isPercentage: true },
  "Ticket Médio": { icon: Icons.Ticket, color: 'bg-teal-500', isCurrency: true },
  "Parcela Média": { icon: Icons.CreditCard, color: 'bg-indigo-500', isCurrency: true },
  "Lucro por Aluno": { icon: Icons.UserDollar, color: 'bg-pink-500', isCurrency: true },
  "Custo por Aluno": { icon: Icons.UserCost, color: 'bg-rose-500', isCurrency: true }, // New KPI config
  "Custo por Turma": { icon: Icons.BuildingStorefront, color: 'bg-lime-600', isCurrency: true },
};