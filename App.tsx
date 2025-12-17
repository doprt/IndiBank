import React, { useState } from 'react';
import { LayoutGrid, ShieldCheck, Landmark, Settings, Bell, LogOut, Banknote, Activity, Package } from 'lucide-react';
import { DeskType } from './types';
import { CreditDesk } from './components/CreditDesk';
import { TreasuryDesk } from './components/TreasuryDesk';
import { LendingDesk } from './components/LendingDesk';
import { SmartContractDesk } from './components/SmartContractDesk';
import { CommodityDesk } from './components/CommodityDesk';

const App: React.FC = () => {
  const [activeDesk, setActiveDesk] = useState<DeskType>(DeskType.CREDIT);

  const renderDesk = () => {
    switch (activeDesk) {
      case DeskType.CREDIT: return <CreditDesk />;
      case DeskType.LENDING: return <LendingDesk />;
      case DeskType.SMART_CONTRACT: return <SmartContractDesk />;
      case DeskType.TREASURY: return <TreasuryDesk />;
      case DeskType.COMMODITY: return <CommodityDesk />;
      default: return <CreditDesk />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Professional Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg bg-blue-600 shadow-blue-900/50">
               <LayoutGrid size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                Trade<span className="text-blue-400">Sync</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Client: Axis Bank Node</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem 
            active={activeDesk === DeskType.CREDIT} 
            onClick={() => setActiveDesk(DeskType.CREDIT)}
            icon={<ShieldCheck size={20} />} 
            label="Credit & Risk Analysis" 
          />
          <NavItem 
            active={activeDesk === DeskType.LENDING} 
            onClick={() => setActiveDesk(DeskType.LENDING)}
            icon={<Banknote size={20} />} 
            label="Lending & Approvals" 
          />
          <NavItem 
            active={activeDesk === DeskType.SMART_CONTRACT} 
            onClick={() => setActiveDesk(DeskType.SMART_CONTRACT)}
            icon={<Activity size={20} />} 
            label="Smart Contract Monitor" 
          />
          <NavItem 
            active={activeDesk === DeskType.TREASURY} 
            onClick={() => setActiveDesk(DeskType.TREASURY)}
            icon={<Landmark size={20} />} 
            label="Treasury & Swaps" 
          />
          <NavItem 
            active={activeDesk === DeskType.COMMODITY} 
            onClick={() => setActiveDesk(DeskType.COMMODITY)}
            icon={<Package size={20} />} 
            label="Commodity Risk Watch" 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
             <div className="text-xs text-slate-400 mb-2">System Status</div>
             <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span>Node Active (Block #49221)</span>
             </div>
          </div>
          <button className="flex items-center space-x-3 text-slate-400 hover:text-white transition px-2 py-2 w-full">
            <LogOut size={18} />
            <span className="text-sm font-medium">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
           <div className="text-sm text-slate-500">
             Active Entity: <span className="font-mono font-bold text-slate-800">AXIS BANK (MUMBAI)</span>
           </div>
           <div className="flex items-center space-x-6">
             <div className="relative cursor-pointer text-slate-500 hover:text-slate-800 transition">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </div>
             <Settings size={20} className="cursor-pointer text-slate-500 hover:text-slate-800 transition" />
             <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
           </div>
        </header>

        {/* Desk Viewport */}
        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
           <div className="max-w-7xl mx-auto">
             {renderDesk()}
           </div>
        </div>

      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-800 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default App;