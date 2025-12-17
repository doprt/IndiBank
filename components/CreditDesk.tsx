import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Search, Building2, Globe, AlertOctagon, Anchor, FileDown, ScanBarcode, ArrowRight, Wallet, Percent, PieChart, FileText, Scale } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_INVOICES, CONCENTRATION_DATA } from '../constants';
import { DeskHeader } from './DeskHeader';
import { getUnderwritingInsight } from '../services/geminiService';
import { Invoice } from '../types';

export const CreditDesk: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'RISK' | 'FINANCE'>('RISK');
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Portfolio Aggregation Calculations
  const totalExposure = MOCK_INVOICES.reduce((sum, inv) => sum + inv.amountINR, 0);
  const projectedRevenue = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.financingProposal?.projectedInterestIncome || 0), 0);
  const weightedRiskScore = (MOCK_INVOICES.reduce((sum, inv) => sum + (inv.riskScore * inv.amountINR), 0) / totalExposure).toFixed(1);
  const netInterestMargin = ((projectedRevenue / totalExposure) * 100).toFixed(2);

  const handleInspect = async (id: string) => {
    setSelectedId(id === selectedId ? null : id);
    setActiveTab('RISK'); // Reset to default tab
    if (id !== selectedId) {
      const inv = MOCK_INVOICES.find(i => i.id === id);
      if (inv) {
        setLoadingAi(true);
        const insight = await getUnderwritingInsight(inv);
        setAiInsight(insight);
        setLoadingAi(false);
      }
    }
  };

  const submitToLending = (id: string) => {
    alert(`Invoice ${id} moved to Lending Desk for Final Approval.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Credit & Underwriting Desk" 
        subtitle="Line Item Risk Grading / Entity Diligence / Exposure Analysis"
        icon={<ShieldCheck size={28} />}
      />

      {/* Portfolio Profit & Risk Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center text-slate-500 text-xs font-bold uppercase mb-1">
               <Wallet size={14} className="mr-2 text-blue-500" /> Total Active Exposure
            </div>
            <div className="text-2xl font-bold text-slate-900">₹{(totalExposure / 10000000).toFixed(2)} Cr</div>
            <div className="text-xs text-slate-400 mt-1">Across {MOCK_INVOICES.length} active facilities</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center text-slate-500 text-xs font-bold uppercase mb-1">
               <Percent size={14} className="mr-2 text-emerald-500" /> Net Interest Margin
            </div>
            <div className="text-2xl font-bold text-emerald-600">{netInterestMargin}%</div>
            <div className="text-xs text-emerald-700/70 mt-1 flex items-center">
              <TrendingUp size={10} className="mr-1" /> +0.15% vs Benchmark
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center text-slate-500 text-xs font-bold uppercase mb-1">
               <PieChart size={14} className="mr-2 text-amber-500" /> Projected Revenue
            </div>
            <div className="text-2xl font-bold text-slate-900">₹{(projectedRevenue / 100000).toFixed(2)} L</div>
            <div className="text-xs text-slate-400 mt-1">Risk-free adjusted estimate</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center text-slate-500 text-xs font-bold uppercase mb-1">
               <Scale size={14} className="mr-2 text-indigo-500" /> Portfolio Risk Score
            </div>
            <div className="text-2xl font-bold text-indigo-600">{weightedRiskScore} / 100</div>
            <div className="text-xs text-slate-400 mt-1">Weighted by exposure volume</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concentration Heatmap */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Exposure Concentration Heatmap</h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">By Industry</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONCENTRATION_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => `₹${(value / 10000000).toFixed(1)} Cr`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="size" radius={[0, 4, 4, 0]}>
                  {CONCENTRATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Logic Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Underwriting Queue</h3>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                 <div className="text-3xl font-bold text-slate-800 mb-1">{MOCK_INVOICES.filter(i => i.status === 'Underwriting').length}</div>
                 <div className="text-xs text-slate-500 font-medium uppercase">Pending Diligence</div>
              </div>
           </div>
           <div className="mt-4">
              <p className="text-xs text-slate-400 text-center italic mb-4">
                 "Risk is not just in the counterparty, but in the correlation of defaults."
              </p>
           </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Inbound Trade Requests</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Ref / ID..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-2 text-slate-400" size={14} />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Reference ID</th>
              <th className="px-6 py-3">Counterparties</th>
              <th className="px-6 py-3 text-right">Amount (GBP)</th>
              <th className="px-6 py-3 text-center">Triple-Check Pulse</th>
              <th className="px-6 py-3 text-center">Score</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_INVOICES.map((inv) => (
              <React.Fragment key={inv.id}>
                <tr className={`transition-colors ${selectedId === inv.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}>
                  <td className="px-6 py-4 font-medium text-slate-900">{inv.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{inv.exporter}</div>
                    <div className="text-xs text-slate-500">To: {inv.importer}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    £{inv.amountGBP.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <PulseItem active={inv.integrity.gstnVerified} label="GSTN" />
                      <PulseItem active={inv.integrity.logisticsVerified} label="e-BL" />
                      <PulseItem active={inv.integrity.dpcVerified} label="DPC" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      inv.riskScore > 80 ? 'bg-green-100 text-green-700' : 
                      inv.riskScore > 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleInspect(inv.id)}
                      className={`font-medium text-xs border px-3 py-1.5 rounded transition ${
                        selectedId === inv.id 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                          : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {selectedId === inv.id ? 'Close' : 'Inspect'}
                    </button>
                  </td>
                </tr>
                {selectedId === inv.id && inv.riskProfile && (
                  <tr className="bg-slate-50/80 border-b border-blue-100">
                    <td colSpan={6} className="px-0">
                      
                      {/* TABS HEADER */}
                      <div className="flex border-b border-slate-200 bg-white">
                         <button 
                           className={`px-8 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'RISK' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                           onClick={() => setActiveTab('RISK')}
                         >
                           Risk & Diligence
                         </button>
                         <button 
                           className={`px-8 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'FINANCE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                           onClick={() => setActiveTab('FINANCE')}
                         >
                           Financing Proposal Details
                         </button>
                      </div>

                      <div className="p-8">
                        <div className="space-y-6 animate-fade-in">
                        
                        {/* TAB 1: RISK & DILIGENCE */}
                        {activeTab === 'RISK' && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* 1. Exporter */}
                              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                                <h4 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                  <Building2 size={14} className="mr-2 text-blue-500" />
                                  Exporter Diligence
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Corp. CIBIL</span>
                                    <div className="flex items-center">
                                      <span className={`text-sm font-bold ${inv.riskProfile.exporter.cibilScore > 750 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {inv.riskProfile.exporter.cibilScore}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">DGFT Data Pull</div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs text-slate-600">IEC Code</span>
                                      <span className="text-xs font-mono font-bold text-slate-800">{inv.riskProfile.exporter.dgft.iecCode}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-slate-600">Status</span>
                                      <span className={`text-[10px] font-bold px-1.5 rounded ${inv.riskProfile.exporter.dgft.iecStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {inv.riskProfile.exporter.dgft.iecStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Transaction */}
                              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col">
                                <h4 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                                  <AlertOctagon size={14} className="mr-2 text-amber-500" />
                                  Transaction Risk
                                </h4>
                                <div className="mb-4 space-y-2">
                                  <div className="flex justify-between text-xs">
                                      <span className="text-slate-500">Importer Score</span>
                                      <span className="font-semibold text-slate-700">{inv.riskProfile.importer.creditAgencyScore}/100 (UK)</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                      <span className="text-slate-500">Fraud Prob</span>
                                      <span className="font-semibold text-slate-700">{inv.riskProfile.transaction.fraudProbability}</span>
                                  </div>
                                </div>
                                <div className="mt-auto bg-slate-50 rounded border border-slate-100 p-3">
                                  <div className="flex items-center text-xs font-bold text-slate-400 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                                    AI UNDERWRITING INSIGHT
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed italic">
                                    {loadingAi ? "Analyzing patterns..." : aiInsight || "Click 'Inspect' to generate insight."}
                                  </p>
                                </div>
                              </div>

                              {/* 3. Action Logic */}
                              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
                                  <div className="text-center mb-4">
                                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">Underwriting Decision</div>
                                      <div className="text-2xl font-bold text-slate-800">{inv.riskScore} / 100</div>
                                      <div className="text-xs text-emerald-600 font-medium">Auto-Pass Threshold Met</div>
                                  </div>
                                  <button 
                                    onClick={() => submitToLending(inv.id)}
                                    className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition flex justify-center items-center group"
                                  >
                                    Submit to Lending Desk <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
                                  </button>
                              </div>
                            </div>
                            
                            {/* LINE ITEM RISK GRADING */}
                            <div className="mt-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                <h4 className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                                  <ScanBarcode size={14} className="mr-2" />
                                  Goods Line-Item Risk Grading
                                </h4>
                              </div>
                              <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                      <th className="px-4 py-2">HS Code</th>
                                      <th className="px-4 py-2">Description</th>
                                      <th className="px-4 py-2 text-right">Value (GBP)</th>
                                      <th className="px-4 py-2 text-center">Risk Grade</th>
                                      <th className="px-4 py-2">Risk Factor</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {inv.lineItems.map(item => (
                                      <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 font-mono text-slate-500">{item.hsCode}</td>
                                        <td className="px-4 py-2 font-medium text-slate-800">{item.description}</td>
                                        <td className="px-4 py-2 text-right">£{item.totalValue.toLocaleString()}</td>
                                        <td className="px-4 py-2 text-center">
                                          <span className={`px-2 py-0.5 rounded font-bold ${
                                            item.riskGrading === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                            item.riskGrading === 'B' ? 'bg-blue-100 text-blue-700' :
                                            item.riskGrading === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                          }`}>
                                            Grade {item.riskGrading}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 text-slate-500 italic">{item.riskReason}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* TAB 2: FINANCING PROPOSAL */}
                        {activeTab === 'FINANCE' && inv.financingProposal && (
                          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                             <div className="flex items-center text-lg font-bold text-slate-800 mb-6">
                                <FileText size={20} className="mr-2 text-indigo-500" />
                                Active Financing Proposal & Treasury Lock
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                   <div className="text-xs text-slate-500 uppercase font-bold mb-1">Interest Rate</div>
                                   <div className="text-2xl font-bold text-slate-900">{inv.financingProposal.interestRate}%</div>
                                   <div className="text-xs text-slate-400 mt-1">p.a. (Fixed)</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                   <div className="text-xs text-slate-500 uppercase font-bold mb-1">Processing Fee</div>
                                   <div className="text-2xl font-bold text-slate-900">₹{inv.financingProposal.processingFee.toLocaleString()}</div>
                                   <div className="text-xs text-slate-400 mt-1">One-time deduction</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                   <div className="text-xs text-slate-500 uppercase font-bold mb-1">Tenure</div>
                                   <div className="text-2xl font-bold text-slate-900">{inv.financingProposal.tenureDays}</div>
                                   <div className="text-xs text-slate-400 mt-1">Days</div>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                   <div className="text-xs text-emerald-600 uppercase font-bold mb-1">Projected Bank Income</div>
                                   <div className="text-2xl font-bold text-emerald-700">₹{inv.financingProposal.projectedInterestIncome.toLocaleString()}</div>
                                   <div className="text-xs text-emerald-600/70 mt-1">Risk-free Net Revenue</div>
                                </div>
                             </div>

                             <div className="border-t border-slate-100 pt-6">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center">
                                   <Anchor size={16} className="mr-2 text-blue-500" />
                                   Treasury Swap Strategy (Underlying)
                                </h4>
                                <div className="bg-slate-900 text-white rounded-lg p-6 grid grid-cols-3 gap-8">
                                   <div>
                                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Spot Reference</div>
                                      <div className="text-xl font-mono text-white">{inv.financingProposal.swapStrategy.spotRef}</div>
                                      <div className="text-xs text-slate-500 mt-1">GBP/INR Live</div>
                                   </div>
                                   <div>
                                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Forward Points</div>
                                      <div className="text-xl font-mono text-blue-400">+{inv.financingProposal.swapStrategy.forwardPoints}</div>
                                      <div className="text-xs text-slate-500 mt-1">Basis Adjustment</div>
                                   </div>
                                   <div>
                                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Effective Hedge Rate</div>
                                      <div className="text-xl font-mono text-emerald-400">{inv.financingProposal.swapStrategy.effectiveHedgeRate}</div>
                                      <div className="text-xs text-slate-500 mt-1">Bank Lock-in Rate</div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PulseItem: React.FC<{ active: boolean; label: string }> = ({ active, label }) => (
  <div className="flex flex-col items-center group cursor-help relative">
    {active ? (
      <CheckCircle2 size={18} className="text-emerald-500" />
    ) : (
      <XCircle size={18} className="text-slate-300" />
    )}
    <span className="text-[10px] font-bold text-slate-400 mt-0.5">{label}</span>
  </div>
);