"use client";
import React, { useState, useMemo } from "react";
import { Filter, Layers, Zap } from "lucide-react";

export default function ModuleMatrixView({ data }) {
  // --- 1. BULLETPROOF DATA PROTECTION ---
  const safeData = Array.isArray(data) ? data : [];

  const [selectedZone, setSelectedZone] = useState("ALL");
  const [selectedInverter, setSelectedInverter] = useState("ALL");

  // --- 2. SAFE MEMOS (Using safeData) ---
  
  // Extract Unique Zones
  const zones = useMemo(() => {
    // Safety check inside useMemo
    if (safeData.length === 0) return ["ALL"];
    const allZones = safeData.map(d => d.zoneName || d.zoneId).filter(Boolean);
    return ["ALL", ...new Set(allZones)];
  }, [safeData]);
  
  // Dynamic Inverter List based on selected Zone
  const inverters = useMemo(() => {
    let filtered = safeData;
    if (selectedZone !== "ALL") {
      filtered = safeData.filter(d => (d.zoneName === selectedZone || d.zoneId === selectedZone));
    }
    const allInverters = filtered.map(d => d.inverterId).filter(Boolean);
    return ["ALL", ...new Set(allInverters)];
  }, [safeData, selectedZone]);

  // Filter the Strings
  const filteredStrings = safeData.filter(str => {
    const matchZone = selectedZone === "ALL" || str.zoneName === selectedZone || str.zoneId === selectedZone;
    const matchInv = selectedInverter === "ALL" || str.inverterId === selectedInverter;
    return matchZone && matchInv;
  });

  // --- 3. SAFETY LOADING STATE ---
  if (safeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Layers size={48} className="mb-4 opacity-20" />
        <p>Loading Module Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- FILTER HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Layers size={20} className="text-blue-600"/> 
            PV String Matrix
          </h3>
          <p className="text-xs text-slate-400">Detailed voltage monitoring per string</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Zone Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Filter size={12} /> Zone:
            </span>
            <select 
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer min-w-25"
              value={selectedZone}
              onChange={(e) => { setSelectedZone(e.target.value); setSelectedInverter("ALL"); }}
            >
              {zones.map(z => <option key={z} value={z}>{z === "ALL" ? "All Zones" : z}</option>)}
            </select>
          </div>

          {/* Inverter Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Zap size={12} /> Inverter:
            </span>
            <select 
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer min-w-25"
              value={selectedInverter}
              onChange={(e) => setSelectedInverter(e.target.value)}
              disabled={inverters.length <= 1} 
            >
              {inverters.map(inv => <option key={inv} value={inv}>{inv === "ALL" ? "All Inverters" : inv}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* --- STRING LIST --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-8 min-h-125">
        {filteredStrings.length > 0 ? (
          filteredStrings.map((string) => (
            <div key={string.id} className="flex flex-col lg:flex-row gap-6 border-b border-slate-100 pb-8 last:border-0 last:pb-0">
              
              {/* String Info Sidebar */}
              <div className="w-full lg:w-48 shrink-0 flex lg:flex-col justify-between lg:justify-start gap-2">
                <div>
                  <h4 className="font-bold text-slate-700 text-lg">{string.id}</h4>
                  <div className="text-xs text-slate-400 font-mono mt-1">{string.inverterId}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{string.zoneName || string.zoneId}</div>
                </div>
                
                {/* Status Badge */}
                <div>
                   <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                     string.status === 'normal' ? 'bg-green-100 text-green-700' :
                     string.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-red-100 text-red-700'
                   }`}>
                     {string.status}
                   </span>
                </div>
              </div>

              {/* The Modules (Blue Boxes) */}
              <div className="flex-1">
                 <div className="flex flex-wrap gap-1.5">
                    {/* SAFE PANEL MAP: Use Optional Chaining */}
                    {string.panels?.map((panel, idx) => {
                       let colorClass = "bg-blue-500"; 
                       if (panel.status === 'offline') colorClass = "bg-slate-300";
                       if (panel.status === 'fault') colorClass = "bg-red-500";
                       
                       return (
                         <div 
                           key={idx} 
                           className={`h-8 w-6 rounded-sm ${colorClass} hover:opacity-80 transition-all cursor-pointer relative group`}
                         >
                           {/* Hover Tooltip */}
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded whitespace-nowrap z-10 shadow-xl">
                              <div className="font-bold mb-1">Panel #{idx + 1}</div>
                              <div>V: {panel.v}V</div>
                              <div>C: {panel.c}A</div>
                           </div>
                         </div>
                       );
                    })}
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <Filter size={48} className="mb-4" />
            <p>No strings found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}