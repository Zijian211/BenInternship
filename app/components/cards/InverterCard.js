import React from "react";
import { Zap, Thermometer, Activity, AlertTriangle, MapPin } from "lucide-react";

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
    <div className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-white ${themeClass.replace('bg-', 'border-')}`}>
      
      {/* ID and Status Icon */}
      <div className="flex justify-between items-start mb-4">
        <div>
           <div className="flex items-center gap-2 text-slate-700">
             <div className={`p-1.5 rounded-lg ${themeClass}`}>
                <Zap size={20} />
             </div>
             <span className="font-bold text-lg">{data.id}</span>
           </div>
           
           {/* Zone Location Badge */}
           <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 ml-1 font-medium">
             <MapPin size={10} />
             <span>{data.zoneName}</span>
           </div>
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-wider border border-current px-2 py-0.5 rounded-full ${themeClass}`}>
          {data.status}
        </span>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {/* Efficiency */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold mb-1">
            <Activity size={12} /> Efficiency
          </div>
          <div className="text-xl font-black text-slate-700">
            {data.efficiency}<span className="text-sm text-slate-400">%</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold mb-1">
            <Thermometer size={12} /> Temp
          </div>
          <div className="text-xl font-black text-slate-700 flex items-center gap-1">
            {data.temp}°
            {data.temp > 50 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
          </div>
        </div>
      </div>
    </div>
  );
}