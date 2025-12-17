import React from 'react';
import { Anchor, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { DeskHeader } from './DeskHeader';
import { MOCK_SHIPMENTS } from '../constants';

export const UKLogisticsDesk: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <DeskHeader 
        title="Inbound Logistics & Customs Monitor" 
        subtitle="HMRC Customs Gate / Real-time GPS / Discrepancy Engine"
        icon={<Anchor size={28} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {MOCK_SHIPMENTS.map(shp => (
            <div key={shp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="h-40 bg-slate-100 relative">
                  {/* Mock Map View */}
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-blue-50/50">
                     <MapPin size={48} className="text-blue-200" />
                     <span className="ml-2 font-bold text-blue-200">GPS LIVE TRACKING: {shp.coordinates.lat}, {shp.coordinates.lng}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded shadow text-xs font-bold text-slate-700">
                     {shp.vessel}
                  </div>
               </div>
               
               <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Route</div>
                        <div className="font-medium text-slate-800">{shp.origin} <span className="text-slate-400">→</span> {shp.destination}</div>
                     </div>
                     <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold ${shp.gpsStatus === 'On Course' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {shp.gpsStatus === 'On Course' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        <span>{shp.gpsStatus}</span>
                     </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                     <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        UK Customs (HMRC CDS) Link
                     </h4>
                     <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center border border-slate-200">
                        <div>
                           <div className="text-xs text-slate-500">Entry Number</div>
                           <div className="text-sm font-mono font-bold text-slate-800">{shp.hmrcRef}</div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded border ${
                           shp.customsStatus.includes('Cleared') 
                           ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                           : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                           {shp.customsStatus}
                        </div>
                     </div>
                     {shp.customsStatus.includes('Cleared') && (
                        <div className="mt-2 text-xs text-emerald-600 flex items-center">
                           <CheckCircle size={12} className="mr-1" />
                           Triggered: Payment Escrow Released
                        </div>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};