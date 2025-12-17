import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertOctagon, FileSignature, CheckCircle2, Lock } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_UK_IMPORTERS, MOCK_DPCS } from '../constants';

export const UKCreditDesk: React.FC = () => {
  const [selectedDpc, setSelectedDpc] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Credit Guarantee & DPC Desk" 
        subtitle="Digital Payment Commitments / Credit Line Earmarking / Sanctions Screening"
        icon={<ShieldCheck size={28} />}
      />

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 font-medium mb-1">Total Earmarked Exposure</div>
           <div className="text-3xl font-bold text-slate-900">£12.4M</div>
           <div className="text-xs text-emerald-600 mt-2 flex items-center">
             <CheckCircle2 size={12} className="mr-1" /> Within Risk Appetite
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 font-medium mb-1">RWA Usage (Capital)</div>
           <div className="text-3xl font-bold text-blue-600">42%</div>
           <div className="text-xs text-slate-400 mt-2">
             Optimized via Digital Assets
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 font-medium mb-1">Pending Signatures</div>
           <div className="text-3xl font-bold text-amber-500">3</div>
           <div className="text-xs text-slate-400 mt-2">
             Requires HSM Key Auth
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Importer Credit Lines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800 flex items-center">
               <UserCheck size={18} className="mr-2 text-blue-500" />
               Importer Credit & Sanctions
            </h3>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500">
                 <tr>
                   <th className="px-6 py-3">Importer</th>
                   <th className="px-6 py-3">Liquidity Headroom</th>
                   <th className="px-6 py-3">OFSI Sanctions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {MOCK_UK_IMPORTERS.map(imp => (
                   <tr key={imp.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium">{imp.name}</td>
                     <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="font-mono text-slate-800">£{imp.availableHeadroom.toLocaleString()}</span>
                           <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                              <div 
                                className={`h-full ${imp.availableHeadroom < 0 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                style={{width: `${Math.max(0, (imp.availableHeadroom/imp.totalCreditLine)*100)}%`}}
                              ></div>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${imp.sanctionsStatus === 'Clean' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {imp.sanctionsStatus}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Checked: {imp.ofsiCheckDate}</div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* DPC Signing Desk */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800 flex items-center">
               <FileSignature size={18} className="mr-2 text-indigo-500" />
               DPC Issuance (Irrevocable)
            </h3>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {MOCK_DPCS.map(dpc => (
               <div key={dpc.commitmentId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer" onClick={() => setSelectedDpc(dpc.commitmentId)}>
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Commitment ID</div>
                        <div className="text-sm font-mono text-slate-800">{dpc.commitmentId}</div>
                     </div>
                     <span className={`px-2 py-1 rounded text-xs font-bold ${dpc.status === 'Signed' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                       {dpc.status}
                     </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                     <div className="flex items-center space-x-2">
                       <span className="text-sm font-bold">£{dpc.amount.toLocaleString()}</span>
                       <span className="text-xs text-slate-500">for {dpc.exporterName}</span>
                     </div>
                     {dpc.status === 'Draft' && (
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition">
                           Sign & Issue
                        </button>
                     )}
                     {dpc.status === 'Signed' && (
                        <div className="flex items-center text-xs text-emerald-600 font-mono">
                           <Lock size={10} className="mr-1" /> {dpc.legalSignature.substring(0, 10)}...
                        </div>
                     )}
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};