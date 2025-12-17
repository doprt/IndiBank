import React from 'react';

interface DeskHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const DeskHeader: React.FC<DeskHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-200">
      <div className="p-3 bg-blue-50 text-blue-700 rounded-lg shadow-sm">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
};