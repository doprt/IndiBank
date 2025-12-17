import React, { useState } from 'react';
import { Globe, ArrowLeftRight, Clock, FileJson, Download, Check } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_GLOBAL_SETTLEMENT } from '../constants';

export const UKSettlementDesk: React.FC = () => {
  const [msgGenerated, setMsgGenerated] = useState<string | null>(null);

  const generateISO = (type: string) => {
    setMsgGenerated(type);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Global Netting & Settlement" 
        subtitle="Multilateral Netting / Daily 4:00 PM Cutoff / pacs.009"
        icon={<Globe size={28} />}
      />

      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
         <div>
            <h3 className="font-bold text-lg flex items-center">
               <Clock size={20} className="mr-2 text-amber-400" />
               Daily Settlement Cutoff
            </h3>
            <p className="text-slate-400 text-sm">Window closes at 16:00 UTC</p>
         </div>
         <div className="text-4xl font-mono font-bold tracking-widest text-emerald-400">
            03:42:15
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Net Position Matrix</h3>
            <span className="text-xs font-mono text-slate-500">Batch: {MOCK_GLOBAL_SETTLEMENT.batchId}</span>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="px-6 py-3">Counterparty Bank</th>
                  <th className="px-6 py-3">Currency</th>
                  <th className="px-6 py-3 text-right">Net Position</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">ISO 20022</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_GLOBAL_SETTLEMENT.counterparties.map((cp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                     <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{cp.bankName}</div>
                        <div className="text-xs text-slate-500">{cp.country}</div>
                     </td>
                     <td className="px-6 py-4 font-mono font-bold text-slate-700">{cp.currency}</td>
                     <td className={`px-6 py-4 text-right font-mono font-bold ${cp.netPosition < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {cp.netPosition < 0 ? `PAY (${Math.abs(cp.netPosition).toLocaleString()})` : `REC ${cp.netPosition.toLocaleString()}`}
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                           cp.status === 'Settled' ? 'bg-slate-100 text-slate-600' :
                           cp.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                           {cp.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <button 
                           onClick={() => generateISO(cp.isoMessage)}
                           className="text-xs border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition"
                        >
                           Gen {cp.isoMessage}
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {msgGenerated && (
         <div className="bg-slate-800 rounded-xl p-6 text-slate-300 font-mono text-xs overflow-auto animate-fade-in relative">
            <div className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer" onClick={() => setMsgGenerated(null)}>x</div>
            <h4 className="text-amber-400 font-bold mb-2">GENERATED PAYLOAD: {msgGenerated.toUpperCase()}</h4>
<pre>{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:${msgGenerated}">
  <FICdtTrf>
    <GrpHdr>
      <MsgId>UK-SETTLE-${Math.floor(Math.random()*10000)}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <IntrBkSttlmAmt Ccy="GBP">4200000.00</IntrBkSttlmAmt>
      <Dbtr>
        <FinInstnId>
           <BICFI>BARCGB22</BICFI>
        </FinInstnId>
      </Dbtr>
      <Cdtr>
        <FinInstnId>
           <BICFI>IBKLINBB</BICFI>
        </FinInstnId>
      </Cdtr>
    </CdtTrfTxInf>
  </FICdtTrf>
</Document>`}</pre>
            <div className="mt-4 flex space-x-4">
               <button className="flex items-center bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-sans font-bold">
                  <Check size={16} className="mr-2" /> Sign & Transmit
               </button>
               <button className="flex items-center bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-sans font-bold">
                  <Download size={16} className="mr-2" /> Download XML
               </button>
            </div>
         </div>
      )}
    </div>
  );
};