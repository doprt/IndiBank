import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, Minus, Rss, AlertTriangle, ArrowUpRight, Search, Activity, Zap } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_COMMODITY_DATA } from '../constants';
import { getCommodityAnalysis } from '../services/geminiService';

export const CommodityDesk: React.FC = () => {
  const [newsCache, setNewsCache] = useState<Record<string, string>>({});
  const [loadingNews, setLoadingNews] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async (name: string, id: string) => {
    if (newsCache[id]) return;
    setLoadingNews(id);
    const analysis = await getCommodityAnalysis(name);
    setNewsCache(prev => ({ ...prev, [id]: analysis }));
    setLoadingNews(null);
  };

  const filteredData = MOCK_COMMODITY_DATA.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <DeskHeader 
        title="Commodity Risk Watch" 
        subtitle="Underlying Asset Volatility / Sector Exposure / AI News Impact"
        icon={<Package size={28} />}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Underlying Asset Monitor</h3>
            <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Commodity..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2 text-slate-400" size={14} />
            </div>
        </div>

        {/* Dense Trading Table */}
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3">Commodity Name</th>
                    <th className="px-6 py-3 text-right">Total Exposure (INR)</th>
                    <th className="px-6 py-3 text-right">VaR (99%)</th>
                    <th className="px-6 py-3 text-center">Volatility Index</th>
                    <th className="px-6 py-3 text-center">Trend</th>
                    <th className="px-6 py-3">Live News Impact</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredData.map(cmd => (
                    <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                            <div className="font-bold text-slate-800">{cmd.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{cmd.sector}</div>
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-slate-700">
                            ₹{(cmd.totalExposureINR / 10000000).toFixed(2)} Cr
                        </td>
                        <td className="px-6 py-3 text-right">
                             <div className="font-mono text-red-600 font-medium">₹{(cmd.varAmount / 100000).toFixed(2)} L</div>
                             <div className="text-[10px] text-slate-400">Potential Loss</div>
                        </td>
                        <td className="px-6 py-3">
                            <div className="flex flex-col items-center">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center ${
                                    cmd.volatilityChange > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {cmd.volatilityChange > 0 ? '+' : ''}{cmd.volatilityChange}%
                                    {cmd.volatilityChange > 0 ? <TrendingUp size={12} className="ml-1"/> : <TrendingDown size={12} className="ml-1"/>}
                                </span>
                                <div className="w-16 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                    <div 
                                        className={`h-full ${cmd.volatilityIndex > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                        style={{width: `${cmd.volatilityIndex}%`}}
                                    ></div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                            {cmd.trend === 'Rising' && <Activity size={18} className="text-emerald-500 mx-auto" />}
                            {cmd.trend === 'Falling' && <Activity size={18} className="text-red-500 mx-auto" />}
                            {cmd.trend === 'Stable' && <Minus size={18} className="text-slate-400 mx-auto" />}
                        </td>
                        <td className="px-6 py-3">
                            <div 
                                className="group cursor-pointer relative"
                                onClick={() => fetchNews(cmd.name, cmd.id)}
                            >
                                <div className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-800 font-medium mb-1">
                                    <Zap size={12} className="fill-blue-600" />
                                    <span>
                                        {loadingNews === cmd.id ? "Analyzing..." : newsCache[cmd.id] ? "Analysis Ready" : "Generate Impact"}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1 italic max-w-xs">
                                    {newsCache[cmd.id] || cmd.newsImpact.summary}
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};