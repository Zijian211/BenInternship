"use client";
import React, { useState, useEffect } from "react";

import MonitoringMenu, { MONITORING_ITEMS } from "./components/menu/MonitoringMenu";
import ManagementMenu, { MANAGEMENT_ITEMS } from "./components/menu/ManagementMenu";

import StationPowerChart from "./components/charts/StationPowerChart";
import StationPowerCard from "./components/cards/StationPowerCard"; 
import InverterCard from "./components/cards/InverterCard";
import ModuleMatrixView from "./components/views/ModuleMatrixView";
import CameraGridView from "./components/views/CameraGridView";
import SensorCard from "./components/cards/SensorCard";
import FieldMap from "./components/charts/FieldMap";
import RobotView from "./components/views/RobotView";

const ALL_ITEMS = [...MONITORING_ITEMS, ...MANAGEMENT_ITEMS];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("station");
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentItem = ALL_ITEMS.find((item) => item.id === activeTab) || ALL_ITEMS[0];

  // --- FETCH DATA ---
  useEffect(() => {
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

    // MODULE TAB LOGIC
    else if (activeTab === 'module') {
      fetch('/api/monitoring/module')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Module API Error:", err))
        .finally(() => setLoading(false));
    }

    // CAMERA TAB LOGIC
    else if (activeTab === 'camera') {
       fetch('/api/monitoring/camera')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Camera API Error:", err))
        .finally(() => setLoading(false));}
    
    // SENSOR TAB LOGIC
    else if (activeTab === 'sensors') {
       fetch('/api/monitoring/sensor')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Sensor API Error:", err))
        .finally(() => setLoading(false));
    }

    // FIELD TAB LOGIC
    else if (activeTab === 'field') { 
       fetch('/api/monitoring/field')
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Field API Error:", err))
        .finally(() => setLoading(false));
    }

    // ROBOT TAB LOGIC
    else if (activeTab === 'robots') {
       fetch('/api/monitoring/robot')
       .then((res) => res.json())
        .then((json) => {
          if (json.data) setStationData(json.data);
        })
        .catch((err) => console.error("Robot API Error:", err))
        .finally(() => setLoading(false));
    }
    
    // OTHER TABS
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
      if (!stationData.kpi || !stationData.trend) return null;

      const { kpi, trend } = stationData;
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* NEW: REPLACED LONG HTML WITH COMPONENT */}
          <StationPowerCard data={kpi} />

          {/* CHART COMPONENT */}
          <StationPowerChart data={trend} />
        </div>
      );
    }

    // INVERTER TAB
    if (activeTab === 'inverter' && stationData && Array.isArray(stationData)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {stationData.map((inv) => (
            <InverterCard key={inv.id} data={inv} />
          ))}
        </div>
      );
    }

    // MODULE MATRIX TAB
    if (activeTab === 'module' && stationData && Array.isArray(stationData)) {
      return <ModuleMatrixView data={stationData} />;
    }

    // CAMERA GRID TAB
    if (activeTab === 'camera' && stationData && Array.isArray(stationData)) {
      return <CameraGridView data={stationData} />;
    }

    // SENSOR TAB
    if (activeTab === 'sensors' && stationData && Array.isArray(stationData)) {
      return <SensorCard data={stationData} />;
    }

    // FIELD VIEW TAB
    if (activeTab === 'field' && stationData && Array.isArray(stationData)) {
      return <FieldMap data={stationData} />;
    }

    // ROBOT VIEW TAB
    if (activeTab === 'robots' && stationData && Array.isArray(stationData)) {
      return <RobotView data={stationData} />;
    }

    // OTHER TABS / EMPTY STATE
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