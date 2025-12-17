import React, { useState } from 'react';
import { Network, FileJson, Check, ArrowRight, Layers, Lock, Download, Building2, Globe } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_NETTING_BATCH, MOCK_INVOICES } from '../constants';

export const NettingDesk: React.FC = () => {
  const [generated, setGenerated] = useState(false);
  const [showXml, setShowXml] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => setShowXml(true), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Netting & Operations Desk" 
        subtitle="Multilateral Netting / ISO 20022 Settlement / Ledger Sync"
        icon={<Network size={28} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: The "Merkle Tree" Aggregator */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center">
                <Layers size={18} className="mr-2 text-indigo-500" />
                Active Netting Batch
              </h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                {MOCK_NETTING_BATCH.id}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-100 -z-10"></div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm text-center w-1/3">
                  <div className="text-2xl font-bold text-slate-800">{MOCK_NETTING_BATCH.totalInvoices}</div>
                  <div className="text-xs text-slate-500">Gross Invoices</div>
                </div>
                
                <div className="bg-white p-2 rounded-full border border-slate-200 text-slate-400">
                   <ArrowRight size={20} />
                </div>

                <div className="bg-white border border-blue-200 bg-blue-50 p-4 rounded-lg shadow-sm text-center w-1/3">
                   <div className="text-2xl font-bold text-blue-700">£{(MOCK_NETTING_BATCH.netAmountGBP / 1000000).toFixed(2)}M</div>
                   <div className="text-xs text-blue-600 font-bold">Net Settlement</div>
                </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cryptographic Proof</h4>
                 <div className="flex items-center bg-slate-100 p-3 rounded-md font-mono text-xs text-slate-600 break-all">
                    <Lock size={14} className="mr-3 flex-shrink-0 text-slate-400" />
                    {MOCK_NETTING_BATCH.merkleRoot}
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-emerald-600 font-medium flex items-center justify-end mt-1">
                      <Check size={12} className="mr-1" /> Merkle Root Verified
                    </span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h3 className="font-semibold text-slate-800 mb-4">Included Invoices</h3>
             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
               {MOCK_INVOICES.slice(0, 3).map(inv => (
                 <div key={inv.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition">
                    <span className="font-mono text-slate-600">{inv.id}</span>
                    <span className="text-slate-800 font-medium">£{inv.amountGBP.toLocaleString()}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Verified</span>
                 </div>
               ))}
               <div className="text-center text-xs text-slate-400 pt-2 italic">
                 + 121 more verified invoices...
               </div>
             </div>
          </div>
        </div>

        {/* Right: ISO 20022 Generator */}
        <div className="bg-slate-900 rounded-xl shadow-lg flex flex-col overflow-hidden text-slate-300">
           <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <h3 className="font-semibold text-white flex items-center">
                 <FileJson size={18} className="mr-2 text-amber-400" />
                 ISO 20022 Engine
              </h3>
              {!generated ? (
                <button 
                  onClick={handleGenerate}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded transition shadow-lg shadow-blue-900/50"
                >
                  Generate pacs.008
                </button>
              ) : (
                <button disabled className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded flex items-center">
                  <Check size={14} className="mr-1" /> Generated
                </button>
              )}
           </div>

           {/* Visualization of Dual-Flow */}
           <div className="bg-slate-800 p-4 border-b border-slate-700 grid grid-cols-2 gap-4">
              <div className={`p-3 rounded border ${generated ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-700/50 border-slate-600'} transition-all duration-500`}>
                 <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center">
                    <Building2 size={10} className="mr-1" /> INR Leg (Local)
                 </div>
                 <div className="text-sm font-bold text-white mb-1">RBI RTGS Gateway</div>
                 <div className="text-xs font-mono text-slate-400">Msg: camt.053 (Stmt)</div>
              </div>
              <div className={`p-3 rounded border ${generated ? 'bg-blue-900/20 border-blue-500/30' : 'bg-slate-700/50 border-slate-600'} transition-all duration-500`}>
                 <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center">
                    <Globe size={10} className="mr-1" /> GBP Leg (Foreign)
                 </div>
                 <div className="text-sm font-bold text-white mb-1">UK CHAPS / FPS</div>
                 <div className="text-xs font-mono text-slate-400">Msg: pacs.008 (Credit)</div>
              </div>
           </div>
           
           <div className="flex-1 p-6 font-mono text-xs overflow-auto relative">
              {showXml ? (
                <div className="animate-fade-in text-blue-200">
                  <div className="text-[10px] text-slate-500 mb-2">// PAYLOAD A: FOREIGN CREDIT TRANSFER (pacs.008)</div>
<pre>{`<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${MOCK_NETTING_BATCH.id}-ISO</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTx>1</NbOfTx>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys>
           <Cd>UK.FPS</Cd>
        </ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>${MOCK_NETTING_BATCH.merkleRoot.substring(0, 16)}</EndToEndId>
        <TxId>${MOCK_NETTING_BATCH.id}</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="GBP">${MOCK_NETTING_BATCH.netAmountGBP.toFixed(2)}</IntrBkSttlmAmt>
      <ChrgBr>DEBT</ChrgBr>
      <Dbtr>
        <Nm>Indian Bank Treasury Node</Nm>
      </Dbtr>
      <Cdtr>
        <Nm>${MOCK_NETTING_BATCH.counterpartyBank}</Nm>
      </Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`}</pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   {generated ? (
                     <div className="flex flex-col items-center">
                       <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                       <p>Signing Payload...</p>
                     </div>
                   ) : (
                     <>
                      <FileJson size={48} className="mb-4 opacity-20" />
                      <p>Awaiting Trigger...</p>
                     </>
                   )}
                </div>
              )}

              {showXml && (
                <div className="absolute bottom-6 right-6">
                   <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition">
                     <Download size={20} />
                   </button>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};