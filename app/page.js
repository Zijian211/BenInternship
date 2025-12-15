"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, Server, Zap, Activity, 
  Search, BarChart3, Radio, ShieldCheck, Camera 
} from 'lucide-react';

// --- CONFIGURATION ---
const MENU_ITEMS = [
  // GROUP 1: Monitoring (Indices 0-7) -> Blue Styles
  { id: 'camera', cn: '实时监控', en: 'CCTV', icon: Camera },
  { id: 'station', cn: '电站层', en: 'STATION STATUS', icon: LayoutDashboard },
  { id: 'field', cn: '场区层', en: 'FIELD VIEW', icon: Server },
  { id: 'inverter', cn: '逆变器层', en: 'INVERTER', icon: Zap },
  { id: 'module', cn: '组件层', en: 'MODULE MATRIX', icon: Activity },
  { id: 'sensors', cn: '传感器', en: 'SENSORS', icon: Radio },
  { id: 'robots', cn: '机器人', en: 'ROBOTS', icon: ShieldCheck },
  { id: 'edge', cn: '边缘计算点', en: 'EDGE NODES', icon: Server },

  // GROUP 2: Management (Indices 8+) -> Grey Styles
  { id: 'inspection', cn: '巡检作业', en: 'INSPECTION', icon: Search },
  { id: 'analysis', cn: '数据分析', en: 'DATA ANALYSIS', icon: BarChart3 },
  { id: 'smart_om', cn: '智能运维', en: 'SMART O&M', icon: Activity },
  { id: 'market', cn: '市场监控', en: 'MARKET MONITOR', icon: Camera },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('station');

  // Helper to find current item details
  const currentItem = MENU_ITEMS.find(item => item.id === activeTab) || MENU_ITEMS[0];

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 font-sans overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-xl z-20 shrink-0">
        
        {/* LOGO AREA */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 shrink-0">
           <h1 className="font-bold text-xl text-blue-900">EMS SYSTEM</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {MENU_ITEMS.map((item, index) => {
            
            // LOGIC: First 8 items (0-7) are "Monitoring".
            const isMonitoringGroup = index < 8; 
            const isActive = activeTab === item.id;

            // Determine which CSS class to use
            let buttonClass = "";
            if (isMonitoringGroup) {
              buttonClass = isActive ? "btn-monitoring-active" : "btn-monitoring";
            } else {
              buttonClass = isActive ? "btn-management-active" : "btn-management";
            }

            // ADD SEPARATION: If this is the first item of the second group (index 8), add top margin
            const extraSpacing = index === 8 ? "mt-6 border-t border-gray-100 pt-1" : "";

            return (
              <div key={item.id} className={extraSpacing}>
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 flex items-center transition-all duration-200 border-b border-gray-50 ${buttonClass}`}
                >
                  <item.icon size={18} className={`mr-3 opacity-80`} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold">{item.cn}</span>
                    <span className="text-[10px] uppercase opacity-70">{item.en}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* --- RIGHT CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white relative">
        
        {/* Header Bar */}
        <header className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
             {currentItem.cn} <span className="text-gray-400 text-sm font-normal ml-2">{currentItem.en}</span>
          </h2>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 p-6 overflow-auto bg-white flex flex-col items-center justify-center text-gray-300">
            <div className="text-6xl mb-4 opacity-20">
              <currentItem.icon size={64} />
            </div>
            <p className="text-xl font-medium">{currentItem.cn} Content Loading...</p>
        </div>

      </main>
    </div>
  );
}