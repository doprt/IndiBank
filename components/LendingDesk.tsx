import React, { useState } from 'react';
import { Banknote, FileCheck, ArrowRight, Percent, Landmark, Check, AlertCircle } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_INVOICES } from '../constants';
import { Invoice } from '../types';

export const LendingDesk: React.FC = () => {
  const readyInvoices = MOCK_INVOICES.filter(i => i.status === 'ReadyToFund' || i.status === 'Underwriting');
  const [fundingId, setFundingId] = useState<string | null>(null);

  const handleFund = (id: string) => {
    setFundingId(id);
    // Simulate funding process
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Lending & Approvals Desk" 
        subtitle="Margin Management / UK Guarantee Verification / INR Disbursement"
        icon={<Banknote size={28} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readyInvoices.map(inv => (
          <div key={inv.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase mb-1">Invoice Ref</div>
                  <div className="text-lg font-bold text-slate-800">{inv.id}</div>
               </div>
               <div className="text-right">
                  <div className="text-xs text-slate-500 font-bold uppercase mb-1">Principal</div>
                  <div className="text-lg font-mono font-bold text-slate-800">£{inv.amountGBP.toLocaleString()}</div>
               </div>
            </div>

            <div className="p-5 flex-1 space-y-5">
               {/* UK Guarantee Check */}
               <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-indigo-800 uppercase flex items-center">
                        <Landmark size={12} className="mr-1" /> UK Bank Guarantee
                     </span>
                     <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-bold">VERIFIED</span>
                  </div>
                  <div className="text-sm text-indigo-900 font-medium">{inv.ukBankCommitment?.bankName}</div>
                  <div className="text-xs text-indigo-500 truncate">{inv.ukBankCommitment?.commitmentType}</div>
               </div>

               {/* Margin Calculator */}
               <div>
                  <div className="text-xs text-slate-500 font-bold uppercase mb-3 flex items-center">
                     <Percent size={12} className="mr-1" /> Margin Split Analysis
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Total Rate to Exporter</span>
                        <span className="font-bold text-slate-900">8.00%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">(-) UK Guarantee Fee</span>
                        <span className="text-red-500">-2.00%</span>
                     </div>
                     <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center bg-emerald-50 p-2 rounded">
                        <span className="text-emerald-800 font-bold text-sm">Net Indian Bank Spread</span>
                        <span className="text-emerald-700 font-bold font-mono">6.00%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-5 border-t border-slate-100">
               {fundingId === inv.id ? (
                  <button disabled className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold flex justify-center items-center cursor-default">
                     <Check size={18} className="mr-2" /> Disbursed & Minted
                  </button>
               ) : (
                  <button 
                    onClick={() => handleFund(inv.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-lg shadow-blue-900/20 flex justify-center items-center"
                  >
                     <FileCheck size={18} className="mr-2" /> Approve & Fund
                  </button>
               )}
               {fundingId === inv.id && (
                  <div className="text-center mt-2 text-xs text-slate-400">
                     Smart Contract deployed to Ledger
                  </div>
               )}
            </div>
          </div>
        ))}

        {readyInvoices.length === 0 && (
           <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No invoices ready for funding approval.</p>
           </div>
        )}
      </div>
    </div>
  );
};