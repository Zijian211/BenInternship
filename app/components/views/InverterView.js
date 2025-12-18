import React, { useState } from "react";
import InverterCard from "../cards/InverterCard";
import { Filter } from "lucide-react";

export default function InverterView({ data }) {
  // Use a fallback to ensure I don't crash on map()
  const safeData = Array.isArray(data) ? data : [];
  
  const [filterZone, setFilterZone] = useState("ALL");

  if (!data) return null;

  // Extract unique zones safely
  const zones = ["ALL", ...new Set(safeData.map(item => item.zoneName).filter(Boolean))];

  // Filter Logic
  const filteredData = filterZone === "ALL" 
    ? safeData 
    : safeData.filter(item => item.zoneName === filterZone);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Bar with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Inverter Fleet Status</h3>
          <p className="text-xs text-slate-400">Real-time conversion efficiency & health</p>
        </div>
        
        {/* The Filter Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <Filter size={14} /> Filter Zone:
          </span>
          <select 
            className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
          >
            {zones.map(z => (
              <option key={z} value={z}>{z === "ALL" ? "Show All" : z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((inv) => (
            <InverterCard key={inv.id} data={inv} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-slate-400">
            No inverters found in this zone.
          </div>
        )}
      </div>
    </div>
  );
}