"use client";
import React, { useState, useEffect } from "react";

import MonitoringMenu, { MONITORING_ITEMS } from "./components/menu/MonitoringMenu";
import ManagementMenu, { MANAGEMENT_ITEMS } from "./components/menu/ManagementMenu";
import StationPowerChart from "./components/charts/StationPowerChart";
import InverterCard from "./components/cards/InverterCard"; 

const ALL_ITEMS = [...MONITORING_ITEMS, ...MANAGEMENT_ITEMS];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("station");
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentItem = ALL_ITEMS.find((item) => item.id === activeTab) || ALL_ITEMS[0];

  // --- FETCH DATA ---
  useEffect(() => {
    // CRITICAL FIX: Reset data immediately to prevent "map is not a function" error
    setStationData(null); 
    setLoading(true);

    // STATION TAB LOGIC
    if (activeTab === 'station') {
      fetch('/api/monitoring/station')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Station API Error:", err))
        .finally(() => setLoading(false));
    }
    
    // INVERTER TAB LOGIC
    else if (activeTab === 'inverter') {
      fetch('/api/monitoring/inverter')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Inverter API Error:", err))
        .finally(() => setLoading(false));
    }

    // OTHER TABS (Stop loading immediately)
    else {
      setLoading(false);
    }
  }, [activeTab]);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    
    // LOADING STATE
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-pulse">
          <p>Loading System Data...</p>
        </div>
      );
    }

    // STATION STATUS TAB
    if (activeTab === 'station' && stationData) {
      // Safety check: Ensure we have the right data shape for Station
      if (!stationData.kpi || !stationData.trend) return null;

      const { kpi, trend } = stationData;
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
               <div className="text-sm text-blue-600 font-bold uppercase mb-1">Real-Time Power</div>
               <div className="text-3xl font-black text-blue-900">
                 {kpi.power.value} <span className="text-lg font-medium">{kpi.power.unit}</span>
               </div>
            </div>
            <div className="p-6 bg-green-50 border border-green-100 rounded-xl shadow-sm">
               <div className="text-sm text-green-600 font-bold uppercase mb-1">Daily Yield</div>
               <div className="text-3xl font-black text-green-900">
                 {kpi.dailyEnergy.value} <span className="text-lg font-medium">{kpi.dailyEnergy.unit}</span>
               </div>
            </div>
            <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl shadow-sm">
               <div className="text-sm text-purple-600 font-bold uppercase mb-1">Safe Operation</div>
               <div className="text-3xl font-black text-purple-900">
                 {kpi.safetyDays} <span className="text-lg font-medium">Days</span>
               </div>
            </div>
             <div className="p-6 bg-orange-50 border border-orange-100 rounded-xl shadow-sm">
               <div className="text-sm text-orange-600 font-bold uppercase mb-1">Condition</div>
               <div className="text-3xl font-black text-orange-900">
                 {kpi.weather.temp}°C <span className="text-lg font-medium">{kpi.weather.condition}</span>
               </div>
            </div>
          </div>

          {/* CHART COMPONENT */}
          <StationPowerChart data={trend} />
        </div>
      );
    }

    // SCENARIO 3: INVERTER TAB
    // Safety check: Ensure stationData is actually an Array before mapping
    if (activeTab === 'inverter' && stationData && Array.isArray(stationData)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {stationData.map((inv) => (
            <InverterCard key={inv.id} data={inv} />
          ))}
        </div>
      );
    }

    // SCENARIO 4: OTHER TABS / EMPTY STATE
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300">
        <currentItem.icon size={64} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">
          {stationData ? "Data Loaded" : `${currentItem.cn} Content Loading...`}
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 overflow-hidden">
      <aside className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-xl shrink-0 z-20">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 shrink-0">
          <h1 className="font-bold text-xl text-blue-900">EMS SYSTEM</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <MonitoringMenu activeTab={activeTab} setActiveTab={setActiveTab} />
          <ManagementMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        <header className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {currentItem.cn}
            <span className="ml-2 text-sm text-gray-400 font-normal">{currentItem.en}</span>
          </h2>
        </header>
        <div className="flex-1 p-8 overflow-auto bg-white">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}