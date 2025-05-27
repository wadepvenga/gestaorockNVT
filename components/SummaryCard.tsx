
import React from 'react';
import type { KPICard } from '../types';

export const SummaryCard: React.FC<KPICard> = ({ label, value, icon, color = 'bg-blue-500' }) => {
  return (
    <div className={`${color} text-white p-5 rounded-xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium opacity-90">{label}</p>
        {icon && <div className="w-6 h-6 opacity-80">{icon}</div>}
      </div>
      <p className="text-2xl md:text-3xl font-bold">{value}</p>
    </div>
  );
};
