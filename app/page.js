"use client";
import React, { useState, useEffect } from "react";

// --- IMPORTS ---
import Sidebar, { getItemDetails } from "./components/menu/Sidebar"; // <--- NEW SIDEBAR
import GitHubLink from "./components/menu/GitHubLink";

// --- VIEWS ---
import StationPowerChart from "./components/charts/StationPowerChart";
import StationPowerCard from "./components/cards/StationPowerCard";
import StationMap from "./components/charts/StationMap";
import InverterView from "./components/views/InverterView";
import ModuleMatrixView from "./components/views/ModuleMatrixView";
import CameraGridView from "./components/views/CameraGridView";
import SensorCard from "./components/cards/SensorCard";
import FieldMap from "./components/charts/FieldMap"; 
import RobotView from "./components/views/RobotView";
import EdgeNodeBar from "./components/charts/EdgeNodeBar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("station"); // Default to Station
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentItem = getItemDetails(activeTab); // Get current Page Title based on activeTab

  // --- FETCH DATA ---
  useEffect(() => {
    setStationData(null); 
    setLoading(true);

    const apiMap = {
      station: '/api/monitoring/station',
      inverter: '/api/monitoring/inverter',
      module: '/api/monitoring/module',
      camera: '/api/monitoring/camera',
      sensors: '/api/monitoring/sensor',
      field: '/api/monitoring/field',
      robots: '/api/monitoring/robot',
      edge: '/api/monitoring/edge',
    };

    const url = apiMap[activeTab];

    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error(`${activeTab} API Error:`, err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-pulse">
          <p>Loading System Data...</p>
        </div>
      );
    }

    // SUB-FUNCTIONS (Inside Real-Time Monitoring)
if (activeTab === 'station' && stationData) {
      if (!stationData.kpi || !stationData.trend) return null;

      return (
        <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* MIDDLE COLUMN: Status & Charts (40% width) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 h-full overflow-y-auto pr-2">
            {/* 1. KPI Cards */}
            <StationPowerCard data={stationData.kpi} />
            
            {/* 2. Chart (Flex-grow to fill remaining height) */}
            <div className="flex-1 min-h-75">
               <StationPowerChart data={stationData.trend} />
            </div>
          </div>

          {/* RIGHT COLUMN: Overall Module Matrix (60% width) */}
          <div className="w-full lg:w-7/12 h-full min-h-125">
            <StationMap data={stationData.map} />
          </div>

        </div>
      );
    }

    if (activeTab === 'field' && stationData && Array.isArray(stationData)) return <FieldMap data={stationData} />;
    if (activeTab === 'inverter' && stationData && Array.isArray(stationData)) {
      return <InverterView data={stationData} />;
    }
    if (activeTab === 'module' && stationData && Array.isArray(stationData)) return <ModuleMatrixView data={stationData} />;
    if (activeTab === 'sensors' && stationData && Array.isArray(stationData)) return <SensorCard data={stationData} />;
    if (activeTab === 'robots' && stationData && Array.isArray(stationData)) return <RobotView data={stationData} />;
    if (activeTab === 'edge' && stationData && Array.isArray(stationData)) return <EdgeNodeBar data={stationData} />;
    if (activeTab === 'camera' && stationData && Array.isArray(stationData)) return <CameraGridView data={stationData} />;

    // MAIN FUNCTIONS for Management
    // Placeholders for now until I build the specific views
    if (['inspection', 'analysis', 'smart_om', 'market'].includes(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <currentItem.icon size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-slate-400">Coming Soon</h3>
          <p>The {currentItem.cn} module is under construction.</p>
        </div>
      );
    }

    // Fallback
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-300">
        <currentItem.icon size={64} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">Select a module from the menu</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 overflow-hidden relative">
      <GitHubLink /> 

      <aside className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-xl shrink-0 z-20">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 shrink-0 bg-slate-50">
          <h1 className="font-bold text-xl text-blue-900 tracking-wider">EMS SYSTEM</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 shrink-0 shadow-sm z-10">
          <div className={`p-2 rounded-lg mr-4 ${activeTab.includes('cctv') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
             <currentItem.icon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-none">{currentItem.cn}</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentItem.en}</span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto bg-slate-50/50">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}