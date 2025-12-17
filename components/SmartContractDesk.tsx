import React, { useState } from 'react';
import { Activity, Box, Map, RefreshCw, CheckCircle, Clock, Truck, Ship, FileText, Globe, Calendar, ShieldCheck } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_INVOICES } from '../constants';

export const SmartContractDesk: React.FC = () => {
  const activeContracts = MOCK_INVOICES.filter(i => i.smartContractData);
  const [expandedId, setExpandedId] = useState<string | null>(activeContracts[0]?.id || null);

  // Aggregation Logic
  const totalValue = activeContracts.reduce((sum, c) => sum + c.amountGBP, 0);
  const countryCounts = activeContracts.reduce((acc, c) => {
    const country = c.smartContractData?.interBankSwapDetails.counterpartyCountry || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Smart Contract Monitor" 
        subtitle="Live Trade Lifecycle / Real-time Risk / Inter-Bank Swap Ledger"
        icon={<Activity size={28} />}
      />

      {/* Global Dashboard Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
         <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Total Locked Value (Smart Contracts)</div>
            <div className="text-2xl font-mono font-bold text-emerald-400">£{totalValue.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-2 flex items-center">
               <ShieldCheck size={12} className="mr-1" /> Fully Collateralized
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Jurisdiction Exposure (Active)</div>
            <div className="flex space-x-4">
               {Object.entries(countryCounts).map(([country, count]) => (
                  <div key={country} className="flex-1 text-center bg-slate-50 rounded p-2 border border-slate-100">
                     <div className="text-lg font-bold text-slate-800">{count}</div>
                     <div className="text-[10px] text-slate-500 truncate">{country.split(' ')[0]}</div>
                  </div>
               ))}
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Maturity Buckets (Aggregated)</div>
            <div className="flex items-end space-x-2 h-12">
               <div className="bg-blue-200 h-full w-1/4 rounded-t relative group"><span className="absolute bottom-1 left-1 text-[10px] font-bold text-blue-800">1M</span></div>
               <div className="bg-blue-400 h-3/4 w-1/4 rounded-t relative group"><span className="absolute bottom-1 left-1 text-[10px] font-bold text-white">3M</span></div>
               <div className="bg-blue-600 h-1/2 w-1/4 rounded-t relative group"><span className="absolute bottom-1 left-1 text-[10px] font-bold text-white">6M</span></div>
               <div className="bg-slate-300 h-1/4 w-1/4 rounded-t relative group"><span className="absolute bottom-1 left-1 text-[10px] font-bold text-slate-600">Spot</span></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
         {/* List of Active Contracts */}
         <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4">
            {activeContracts.map(inv => (
               <div 
                  key={inv.id} 
                  onClick={() => setExpandedId(inv.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                     expandedId === inv.id 
                     ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                     : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                  }`}
               >
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold opacity-70">CONTRACT ADDRESS</span>
                     <span className="text-[10px] font-mono bg-black/20 px-2 py-0.5 rounded">
                        {inv.smartContractData?.contractAddress}
                     </span>
                  </div>
                  <div className="font-bold text-lg mb-1">{inv.exporter}</div>
                  <div className="text-sm opacity-80 flex justify-between">
                     <span>{inv.importer}</span>
                     <span>£{inv.amountGBP.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex items-center text-xs font-bold">
                     <span className={`w-2 h-2 rounded-full mr-2 ${expandedId === inv.id ? 'bg-emerald-300' : 'bg-emerald-500'}`}></span>
                     {inv.smartContractData?.status.replace('_', ' ')}
                  </div>
               </div>
            ))}
             {activeContracts.length === 0 && (
               <div className="p-8 text-center text-slate-400">No active smart contracts.</div>
             )}
         </div>

         {/* Detailed View */}
         <div className="lg:col-span-2 bg-slate-900 text-white rounded-xl p-6 shadow-2xl overflow-y-auto">
            {expandedId && activeContracts.find(c => c.id === expandedId) ? (
               <div className="space-y-8 animate-fade-in">
                  {(() => {
                     const inv = activeContracts.find(c => c.id === expandedId)!;
                     return (
                        <>
                           {/* Header */}
                           <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                              <div>
                                 <h2 className="text-2xl font-bold">{inv.id} Live Monitor</h2>
                                 <p className="text-slate-400 text-sm mt-1">Last Block Update: {inv.smartContractData?.lastUpdate}</p>
                              </div>
                              <div className="text-right">
                                 <div className="text-xs text-slate-400 uppercase">Live Risk Score</div>
                                 <div className={`text-3xl font-bold ${inv.smartContractData!.liveMetrics.riskScoreCurrent > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {inv.smartContractData?.liveMetrics.riskScoreCurrent} / 100
                                 </div>
                              </div>
                           </div>

                           {/* Pipeline Visual */}
                           <div className="flex justify-between items-center relative">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -z-10"></div>
                              {['MINTED', 'TRANSIT', 'CUSTOMS', 'SETTLED'].map((step, idx) => {
                                 // Simple logic for active step visualization based on mock status
                                 // status mapping: AWAITING_FUNDS->0, ACTIVE_TRANSIT->1, CUSTOMS_HOLD->2, SETTLED->3
                                 let currentIdx = 0;
                                 if (inv.smartContractData?.status === 'ACTIVE_TRANSIT') currentIdx = 1;
                                 if (inv.smartContractData?.status === 'CUSTOMS_HOLD' || inv.smartContractData?.status === 'PAYMENT_PENDING') currentIdx = 2;
                                 if (inv.smartContractData?.status === 'SETTLED') currentIdx = 3;

                                 const isActive = idx <= currentIdx;
                                 return (
                                    <div key={step} className="flex flex-col items-center bg-slate-900 px-2">
                                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                                          {idx === 0 && <CheckCircle size={14} />}
                                          {idx === 1 && <Ship size={14} />}
                                          {idx === 2 && <Box size={14} />}
                                          {idx === 3 && <CheckCircle size={14} />}
                                       </div>
                                       <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>{step}</span>
                                    </div>
                                 );
                              })}
                           </div>

                           {/* INTER-BANK SWAP LEDGER (New Section) */}
                           <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                                 <h3 className="text-sm font-bold text-emerald-400 flex items-center">
                                    <FileText size={16} className="mr-2" />
                                    Inter-Bank Swap Contract (ISDA Layer)
                                 </h3>
                                 <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400 text-[10px] font-mono border border-emerald-800">
                                    {inv.smartContractData?.interBankSwapDetails.isdaVersion}
                                 </span>
                              </div>
                              <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                 <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Counterparty Bank</div>
                                    <div className="font-bold text-white flex items-center">
                                       <Globe size={14} className="mr-2 text-slate-400" />
                                       {inv.smartContractData?.interBankSwapDetails.counterpartyBank}
                                    </div>
                                 </div>
                                 <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Master Agreement ID</div>
                                    <div className="font-mono text-slate-300">{inv.smartContractData?.interBankSwapDetails.masterAgreementId}</div>
                                 </div>
                                 <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Jurisdiction</div>
                                    <div className="text-white">{inv.smartContractData?.interBankSwapDetails.counterpartyCountry}</div>
                                 </div>
                                 <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Maturity Bucket</div>
                                    <div className="flex items-center space-x-2">
                                       <Calendar size={14} className="text-slate-400" />
                                       <span className="font-bold text-white">{inv.smartContractData?.interBankSwapDetails.maturityBucket}</span>
                                       <span className="text-xs text-slate-500">({inv.smartContractData?.interBankSwapDetails.maturityDate})</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Metrics Grid */}
                           <div className="grid grid-cols-2 gap-6">
                              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                                    <Map size={14} className="mr-2 text-blue-400" /> Logistics & GPS
                                 </h3>
                                 <div className="text-sm font-medium mb-1">{inv.smartContractData?.liveMetrics.logisticsStatus}</div>
                                 <div className="text-xs text-slate-500 font-mono">
                                    Coords: {inv.logistics?.coordinates?.lat}, {inv.logistics?.coordinates?.lng}
                                 </div>
                                 <div className="mt-3 text-xs bg-slate-700/50 p-2 rounded text-slate-300">
                                    Est. Arrival: {inv.logistics?.estimatedArrival}
                                 </div>
                              </div>

                              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center">
                                    <RefreshCw size={14} className="mr-2 text-emerald-400" /> Swap Performance (MTM)
                                 </h3>
                                 <div className={`text-2xl font-mono font-bold ${inv.smartContractData!.liveMetrics.swapMTM >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {inv.smartContractData!.liveMetrics.swapMTM >= 0 ? '+' : ''}₹{inv.smartContractData?.liveMetrics.swapMTM.toLocaleString()}
                                 </div>
                                 <div className="text-xs text-slate-500 mt-1">
                                    Hedge Rate: {inv.financingProposal?.swapStrategy.effectiveHedgeRate}
                                 </div>
                                 <div className="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full w-3/4 ${inv.smartContractData!.liveMetrics.swapMTM >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                 </div>
                              </div>
                           </div>

                        </>
                     );
                  })()}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Activity size={48} className="mb-4 opacity-20" />
                  <p>Select a smart contract to monitor.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};