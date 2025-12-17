import React, { useState } from 'react';
import { Landmark, ArrowLeftRight, Activity, Zap, RefreshCw, CheckCircle2, Globe, Building, Scale, AlertTriangle, FileText, BarChart3, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Layers, BookOpen, GitMerge, Shield } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend } from 'recharts';
import { MOCK_RATES, BASIS_HISTORY, SWAP_CONFIG, MOCK_LIQUIDITY_PROVIDERS, MOCK_RISK_METRICS, MOCK_REGULATORY_LOGS, MOCK_SWAP_HISTORY, MOCK_MATURITY_PROFILE } from '../constants';
import { DeskHeader } from './DeskHeader';
import { getTreasuryAnalysis } from '../services/geminiService';
import { GeminiAnalysis } from '../types';

export const TreasuryDesk: React.FC = () => {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const [activeTab, setActiveTab] = useState<'MARKET' | 'LIQUIDITY' | 'RISK' | 'REGULATORY' | 'WORKFLOW'>('MARKET');
  const [timeframe, setTimeframe] = useState<'1D' | '1M' | '1Y'>('1M');
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  
  // New Trade Config State
  const [settlementCycle, setSettlementCycle] = useState('T+2 (Spot)');
  const [targetCounterparty, setTargetCounterparty] = useState('Best Execution (Aggregated)');

  const runAnalysis = async () => {
    setLoading(true);
    const result = await getTreasuryAnalysis(MOCK_RATES);
    setAnalysis(result);
    setLoading(false);
  };

  const executeSwap = () => {
    setSwapped(true);
    setTimeout(() => setSwapped(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <DeskHeader 
        title="Treasury & Swap Desk" 
        subtitle="Inter-bank Liquidity / FX Hedging / Regulatory Reporting"
        icon={<Landmark size={28} />}
      />

      {/* Live Tickers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TickerCard label="GBP/INR Spot" value={MOCK_RATES.spot.toFixed(2)} trend="+0.12%" neutral={false} />
        <TickerCard label="UK SONIA (Ref)" value={`${MOCK_RATES.sonia}%`} trend="0.00%" neutral={true} />
        <TickerCard label="INR MIFOR (Ref)" value={`${MOCK_RATES.mifor}%`} trend="+0.05%" neutral={false} />
        <TickerCard label="Basis Spread" value={`${MOCK_RATES.basisSpread} bps`} trend="-2 bps" neutral={false} highlight />
      </div>

      {/* TABS Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl overflow-hidden shadow-sm mt-4">
        <TabButton label="Live Market" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} icon={<Activity size={16} />} />
        <TabButton label="Liquidity & Netting" active={activeTab === 'LIQUIDITY'} onClick={() => setActiveTab('LIQUIDITY')} icon={<Building size={16} />} />
        <TabButton label="Swap Risk Analysis" active={activeTab === 'RISK'} onClick={() => setActiveTab('RISK')} icon={<Scale size={16} />} />
        <TabButton label="Workflow & SOP" active={activeTab === 'WORKFLOW'} onClick={() => setActiveTab('WORKFLOW')} icon={<BookOpen size={16} />} />
        <TabButton label="Regulatory Reporting" active={activeTab === 'REGULATORY'} onClick={() => setActiveTab('REGULATORY')} icon={<FileText size={16} />} />
      </div>

      <div className="bg-white p-6 rounded-b-xl border-x border-b border-slate-200 shadow-sm min-h-[600px]">
        
        {/* TAB 1: MARKET */}
        {activeTab === 'MARKET' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-800">Basis Swap Curve</h3>
                    <div className="flex space-x-2">
                       <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded shadow-sm">1D</button>
                    </div>
                 </div>
                 <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={BASIS_HISTORY}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                       <Line type="monotone" dataKey="spread" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              {/* Swap Execution Panel */}
              <div className="flex flex-col space-y-4">
                 
                 {/* Trade Configuration */}
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Trade Configuration</h4>
                    <div>
                       <label className="block text-xs font-medium text-slate-600 mb-1">Counterparty Bank</label>
                       <select 
                          className="w-full text-sm border-slate-300 rounded-md shadow-sm p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          value={targetCounterparty}
                          onChange={(e) => setTargetCounterparty(e.target.value)}
                       >
                          <option>Best Execution (Aggregated)</option>
                          {MOCK_LIQUIDITY_PROVIDERS.map(lp => (
                             <option key={lp.id}>{lp.bankName}</option>
                          ))}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-600 mb-1">Settlement Cycle</label>
                       <select 
                          className="w-full text-sm border-slate-300 rounded-md shadow-sm p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          value={settlementCycle}
                          onChange={(e) => setSettlementCycle(e.target.value)}
                       >
                          <option>T+0 (Intraday)</option>
                          <option>T+1 (Tom)</option>
                          <option>T+2 (Spot)</option>
                          <option>Monthly (End of Month)</option>
                          <option>Quarterly (IMM Dates)</option>
                       </select>
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Confirm Particulars</h4>
                    <div className="space-y-3">
                       <Row label="Spot Ref" value={MOCK_RATES.spot.toFixed(2)} />
                       <Row label="Basis Spread" value={`${MOCK_RATES.basisSpread} bps`} highlight />
                       <Row label="Cycle" value={settlementCycle.split(' ')[0]} />
                       <Row label="Haircut" value={`${SWAP_CONFIG.collateralHaircut}%`} />
                    </div>
                 </div>
                 
                 <button 
                  onClick={executeSwap}
                  disabled={swapped}
                  className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all flex justify-center items-center ${swapped ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                  {swapped ? (
                      <><CheckCircle2 size={20} className="mr-2" /> Trade Confirmed</>
                  ) : (
                      <><ArrowLeftRight size={20} className="mr-2" /> Execute Swap</>
                  )}
                  </button>

                 {/* DETAILED CONTRACT INFO SECTION */}
                 <div className="mt-4 bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                        <FileText size={14} className="mr-2" /> Inter-Bank Contract Details
                    </h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">ISDA Version</span>
                            <span className="font-medium text-slate-800">ISDA 2002 Master</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Master Agreement ID</span>
                            <span className="font-mono text-slate-800">
                                {targetCounterparty === 'Best Execution (Aggregated)' 
                                    ? 'MA-AXIS-MULT-2024' 
                                    : `MA-AXIS-${targetCounterparty.split(' ')[0].toUpperCase()}-2021`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Counterparty Bank</span>
                            <span className="font-medium text-slate-800">{targetCounterparty}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Counterparty Country</span>
                            <span className="font-medium text-slate-800">United Kingdom</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Maturity Bucket</span>
                            <span className="font-medium text-slate-800">
                                {settlementCycle.includes('Monthly') ? '1 Month' : 
                                 settlementCycle.includes('Quarterly') ? '3 Months' : 
                                 settlementCycle.includes('Tom') ? 'Overnight' : 'Spot (<1W)'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Settlement Cycle</span>
                            <span className="font-medium text-slate-800">{settlementCycle}</span>
                        </div>
                    </div>
                 </div>

              </div>
           </div>
        )}

        {/* TAB 2: INTER-BANK LIQUIDITY & NETTING */}
        {activeTab === 'LIQUIDITY' && (
           <div className="animate-fade-in space-y-8">
              {/* Liquidity Table */}
              <div>
                  <div className="mb-4 flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Available GBP Liquidity Pool</h3>
                      <p className="text-sm text-slate-500">Live order book from connected UK counterparties.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-bold uppercase">Weighted Avg Cost</div>
                      <div className="text-2xl font-mono text-emerald-600 font-bold">5.23%</div>
                    </div>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr>
                             <th className="px-6 py-3">Liquidity Provider</th>
                             <th className="px-6 py-3">Quote (GBP Cost)</th>
                             <th className="px-6 py-3 text-right">Limit</th>
                             <th className="px-6 py-3 text-right">Gross Pay</th>
                             <th className="px-6 py-3 text-right">Gross Rec</th>
                             <th className="px-6 py-3 text-center">Net Impact</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {MOCK_LIQUIDITY_PROVIDERS.map((lp, idx) => {
                             const net = lp.grossReceivable - lp.grossPayable;
                             return (
                             <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                   <Globe size={16} className="mr-2 text-slate-400" /> {lp.bankName}
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-slate-700">
                                   {lp.quoteGBP}%
                                </td>
                                <td className="px-6 py-4 text-right">
                                   £{(lp.availableLimit / 1000000).toFixed(1)}M
                                </td>
                                <td className="px-6 py-4 text-right text-red-600">
                                   (£{(lp.grossPayable / 1000000).toFixed(1)}M)
                                </td>
                                <td className="px-6 py-4 text-right text-emerald-600">
                                   £{(lp.grossReceivable / 1000000).toFixed(1)}M
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <span className={`px-2 py-1 rounded text-xs font-bold ${net > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                      {net > 0 ? 'REC ' : 'PAY '} £{Math.abs(net/1000000).toFixed(1)}M
                                   </span>
                                </td>
                             </tr>
                          )})}
                       </tbody>
                    </table>
                  </div>
              </div>

              {/* Netting Visualization */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                 <h3 className="font-bold text-slate-800 flex items-center mb-4">
                    <Layers size={20} className="mr-2 text-indigo-500" />
                    Netting Settlement Engine
                 </h3>
                 <div className="flex items-center justify-between">
                    <div className="text-center">
                       <div className="text-xs font-bold text-slate-400 uppercase">Total Gross Outflow</div>
                       <div className="text-xl font-bold text-red-600">£77.0M</div>
                    </div>
                    <div className="h-1 flex-1 mx-4 bg-slate-200 rounded overflow-hidden flex">
                       <div className="bg-red-400 h-full w-1/2"></div>
                       <div className="bg-emerald-400 h-full w-1/2"></div>
                    </div>
                     <div className="text-center">
                       <div className="text-xs font-bold text-slate-400 uppercase">Total Gross Inflow</div>
                       <div className="text-xl font-bold text-emerald-600">£72.5M</div>
                    </div>
                 </div>
                 <div className="flex justify-center mt-6">
                    <div className="bg-white border-2 border-indigo-100 p-4 rounded-xl shadow-sm flex items-center space-x-4">
                       <div className="p-2 bg-indigo-50 rounded-full text-indigo-600"><RefreshCw size={24} /></div>
                       <div>
                          <div className="text-xs font-bold text-indigo-500 uppercase">Final Net Settlement</div>
                          <div className="text-2xl font-bold text-slate-800">PAY £4.5M</div>
                          <div className="text-[10px] text-slate-400">Only net difference settled via RTGS/CHAPS</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB 3: ADVANCED RISK ENGINEERING */}
        {activeTab === 'RISK' && (
           <div className="animate-fade-in space-y-6">
              
              {/* Controls */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex space-x-2">
                     {['1D', '1M', '1Y'].map(t => (
                        <button 
                           key={t}
                           onClick={() => setTimeframe(t as any)}
                           className={`px-3 py-1 text-xs font-bold rounded transition ${timeframe === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>
                  <div className="flex items-center space-x-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">Counterparty:</span>
                     <select 
                        className="text-xs border-slate-300 rounded border px-2 py-1 bg-white outline-none"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                     >
                        <option value="ALL">All Banks (Aggregated)</option>
                        {MOCK_LIQUIDITY_PROVIDERS.map(lp => <option key={lp.id} value={lp.bankName}>{lp.bankName}</option>)}
                     </select>
                  </div>
              </div>

              {/* Maturity Ladder Visualization */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                 <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-500" />
                    Swap Book Maturity Ladder (Monthly/Quarterly)
                 </h4>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={MOCK_MATURITY_PROFILE}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="bucket" tick={{fontSize: 12}} />
                          <YAxis tickFormatter={(val) => `£${val/1000000}M`} tick={{fontSize: 12}} />
                          <Tooltip formatter={(val: number) => `£${(val/1000000).toFixed(1)}M`} />
                          <Bar dataKey="exposure" name="Exposure (GBP)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Left Column: Metrics & Greeks */}
                 <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
                       <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center">
                          <Activity size={14} className="mr-2" />
                          Greek Sensitivity
                       </h4>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-2 bg-slate-800 rounded">
                             <div className="text-[10px] text-slate-400">Delta (Spot)</div>
                             <div className="font-mono font-bold text-blue-400">{MOCK_RISK_METRICS.delta}</div>
                          </div>
                          <div className="p-2 bg-slate-800 rounded">
                             <div className="text-[10px] text-slate-400">Gamma (Acccl)</div>
                             <div className="font-mono font-bold text-purple-400">{MOCK_RISK_METRICS.gamma}</div>
                          </div>
                          <div className="p-2 bg-slate-800 rounded">
                             <div className="text-[10px] text-slate-400">Theta (Time)</div>
                             <div className="font-mono font-bold text-red-400">{MOCK_RISK_METRICS.theta}</div>
                          </div>
                          <div className="p-2 bg-slate-800 rounded">
                             <div className="text-[10px] text-slate-400">Vega (Vol)</div>
                             <div className="font-mono font-bold text-amber-400">{MOCK_RISK_METRICS.vega}</div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                       <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Notional Loss Potential (VaR)</h4>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">99% Confidence</span>
                          <span className="text-lg font-bold text-red-600">₹{(MOCK_RISK_METRICS.var99 / 100000).toFixed(2)} L</span>
                       </div>
                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{width: '65%'}}></div>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Stress Test (GBP -5%)</div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">PASS</span>
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Charts & Analysis */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                       <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-slate-700">Swap P&L vs Basis Spread Correlation</h4>
                       </div>
                       <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={MOCK_SWAP_HISTORY}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="day" tick={{fontSize: 10}} />
                             <YAxis yAxisId="left" orientation="left" tick={{fontSize: 10}} />
                             <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10}} />
                             <Tooltip />
                             <Legend />
                             <Bar yAxisId="left" dataKey="pnl" name="P&L (INR)" fill="#10b981" barSize={20} radius={[4, 4, 0, 0]} />
                             <Line yAxisId="right" type="monotone" dataKey="basis" name="Basis Spread (bps)" stroke="#3b82f6" strokeWidth={2} />
                          </ComposedChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start space-x-4">
                       <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600 mt-1">
                          <Zap size={18} />
                       </div>
                       <div className="flex-1">
                          <div className="text-xs font-bold text-indigo-800 uppercase mb-1">AI Risk Assessment</div>
                          {loading ? (
                             <div className="text-sm text-indigo-600 animate-pulse">Running Monte Carlo simulations...</div>
                          ) : analysis ? (
                             <div>
                                <p className="text-sm font-bold text-indigo-900 mb-1">{analysis.recommendation}</p>
                                <p className="text-xs text-indigo-700 leading-relaxed">{analysis.riskAssessment}</p>
                             </div>
                          ) : (
                             <button onClick={runAnalysis} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition">
                                Generate Insight
                             </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB 4: WORKFLOW & SOP */}
        {activeTab === 'WORKFLOW' && (
           <div className="animate-fade-in space-y-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <h3 className="font-bold text-slate-800 flex items-center mb-6">
                    <GitMerge size={20} className="mr-2 text-indigo-500" />
                    Inter-Bank Swap Settlement SOP
                 </h3>

                 {/* Visual Lifecycle */}
                 <div className="flex justify-between items-center relative mb-12">
                     <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -z-10"></div>
                     {[
                        { step: '1. Trade Booking', role: 'Front Office' },
                        { step: '2. Confirmation', role: 'Mid Office' },
                        { step: '3. Nostro Funding', role: 'Treasury' },
                        { step: '4. ISO Settlement', role: 'Back Office' }
                     ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center bg-slate-50 px-4">
                           <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm mb-2 shadow-sm border-4 border-slate-50">
                              {i + 1}
                           </div>
                           <div className="text-sm font-bold text-slate-800">{s.step}</div>
                           <div className="text-xs text-slate-500">{s.role}</div>
                        </div>
                     ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Cash Flow Table */}
                     <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                           Projected Cash Flows
                        </div>
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                              <tr>
                                 <th className="px-4 py-2">Direction</th>
                                 <th className="px-4 py-2">Entity</th>
                                 <th className="px-4 py-2">Details</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              <tr>
                                 <td className="px-4 py-3 font-bold text-red-600">OUT (INR)</td>
                                 <td className="px-4 py-3">To Exporter</td>
                                 <td className="px-4 py-3 text-slate-500 text-xs">Principal Disbursement</td>
                              </tr>
                              <tr>
                                 <td className="px-4 py-3 font-bold text-emerald-600">IN (GBP)</td>
                                 <td className="px-4 py-3">From UK Bank</td>
                                 <td className="px-4 py-3 text-slate-500 text-xs">Liquidity Swap Leg 1</td>
                              </tr>
                              <tr>
                                 <td className="px-4 py-3 font-bold text-red-600">OUT (GBP)</td>
                                 <td className="px-4 py-3">To Swap Prov.</td>
                                 <td className="px-4 py-3 text-slate-500 text-xs">Interest Service (Monthly)</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>

                     {/* Regulatory Compliance Checklist */}
                     <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                           Regulatory Checkpoints
                        </div>
                        <div className="p-4 space-y-4">
                           <div className="flex items-start">
                              <Shield size={16} className="mr-3 text-blue-500 mt-0.5" />
                              <div>
                                 <div className="text-sm font-bold text-slate-800">RBI FEMA Notification</div>
                                 <div className="text-xs text-slate-500">Foreign Exchange Management (Export of Goods) Regulations, 2015. Confirms 9-month handling period.</div>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <Shield size={16} className="mr-3 text-purple-500 mt-0.5" />
                              <div>
                                 <div className="text-sm font-bold text-slate-800">UK FCA Derivatives Reporting</div>
                                 <div className="text-xs text-slate-500">MIFID II Transaction Reporting required for underlying FX Swaps > £1M.</div>
                              </div>
                           </div>
                           <div className="flex items-start">
                              <FileText size={16} className="mr-3 text-emerald-500 mt-0.5" />
                              <div>
                                 <div className="text-sm font-bold text-slate-800">Message Standards</div>
                                 <div className="text-xs text-slate-500">
                                    <span className="font-mono bg-slate-100 px-1 rounded">pacs.008</span> (Credit) & 
                                    <span className="font-mono bg-slate-100 px-1 rounded ml-1">fxtr.014</span> (FX Trade)
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB 5: REGULATORY */}
        {activeTab === 'REGULATORY' && (
           <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-800">Compliance & Reporting Hub</h3>
                 <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center">
                       <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> RBI Gateway Active
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> FCA/ESMA Sync
                    </span>
                 </div>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-lg">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                       <tr>
                          <th className="px-6 py-3">Authority</th>
                          <th className="px-6 py-3">Compliance Type</th>
                          <th className="px-6 py-3">Ref ID</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Timestamp</th>
                          <th className="px-6 py-3">Details</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {MOCK_REGULATORY_LOGS.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-bold text-slate-700">{log.authority}</td>
                             <td className="px-6 py-4 font-medium text-blue-600">{log.type}</td>
                             <td className="px-6 py-4 font-mono text-xs">{log.referenceId}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                   log.status === 'Acknowledged' ? 'bg-emerald-100 text-emerald-700' : 
                                   log.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                }`}>
                                   {log.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-slate-500 text-xs">{log.timestamp}</td>
                             <td className="px-6 py-4 text-slate-500 text-xs italic">{log.details}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
       active ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-b border-slate-200'
    }`}
  >
     {icon}
     <span>{label}</span>
  </button>
);

const TickerCard: React.FC<{ label: string; value: string; trend: string; neutral: boolean; highlight?: boolean }> = ({ label, value, trend, neutral, highlight }) => (
  <div className={`p-4 rounded-xl border shadow-sm ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
    <div className="flex items-baseline space-x-2">
      <span className={`text-2xl font-bold ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>{value}</span>
    </div>
    <div className={`text-xs font-medium mt-1 ${neutral ? 'text-slate-400' : trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
      {trend} since open
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center group">
     <span className="text-sm text-slate-500">{label}</span>
     <span className={`font-mono font-bold ${highlight ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded' : 'text-slate-800'}`}>
        {value}
     </span>
  </div>
);