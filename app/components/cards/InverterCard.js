"use client";
import React from "react";
import { Zap, Thermometer, Activity, AlertTriangle } from "lucide-react";

export default function InverterCard({ data }) {
  // Determine Color Theme based on Status
  const getStatusColor = (status) => {
    switch (status) {
      case "Normal": return "bg-green-50 border-green-200 text-green-700";
      case "Warning": return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "Offline": return "bg-gray-50 border-gray-200 text-gray-500";
      default: return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const themeClass = getStatusColor(data.status);

  return (
    <div className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${themeClass}`}>
      {/* HEADER: ID and Status Icon */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Zap size={20} />
          <span className="font-bold text-lg">{data.id}</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider border border-current px-2 py-1 rounded-full">
          {data.status}
        </span>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Efficiency */}
        <div className="bg-white/60 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
            <Activity size={12} /> Efficiency
          </div>
          <div className="text-xl font-bold">
            {data.efficiency}%
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white/60 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
            <Thermometer size={12} /> Temp
          </div>
          <div className="text-xl font-bold flex items-center">
            {data.temp}°C
            {/* Show warning icon if hot */}
            {data.temp > 50 && <AlertTriangle size={16} className="text-red-500 ml-1" />}
          </div>
        </div>

      </div>
    </div>
  );
}