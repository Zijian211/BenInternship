import React from "react";
import { Zap, AlertTriangle, CheckCircle, XCircle, Grid3x3 } from "lucide-react";

export default function FieldMap({ data }) {
  if (!data) return null;

  // Status Colors & Icons
  const getStatusConfig = (status) => {
    switch (status) {
      case "normal": return { color: "bg-green-500", glow: "shadow-green-500/50", icon: CheckCircle };
      case "warning": return { color: "bg-orange-500", glow: "shadow-orange-500/50", icon: AlertTriangle };
      case "offline": return { color: "bg-gray-500", glow: "shadow-gray-500/50", icon: XCircle };
      default: return { color: "bg-blue-500", glow: "shadow-blue-500/50", icon: Zap };
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Station Spatial View</h3>
          <p className="text-sm text-slate-400">Real-time Zone Topology</p>
        </div>
        {/* Legend */}
        <div className="flex gap-4 text-xs font-medium">
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Normal</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Warning</div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-500"></span> Offline</div>
        </div>
      </div>

      {/* The Map Container */}
      <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner group cursor-crosshair">
        
        {/* Decorative Grid Background (Simulates GIS Map) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Render Zones as 'Pins' */}
        {data.map((zone) => {
          const config = getStatusConfig(zone.status);
          const Icon = config.icon;
          
          return (
            <div 
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group/pin"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            >
              
              {/* Pulsing Effect (Animation) */}
              <div className={`absolute -inset-4 rounded-full opacity-20 animate-ping ${config.color}`}></div>
              
              {/* The Pin Icon */}
              <div className={`relative w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center text-white shadow-xl transition-transform hover:scale-110 cursor-pointer ${config.color} ${config.glow}`}>
                <Icon size={20} />
              </div>

              {/* Hover Tooltip (Data Card) */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-60 bg-white/95 backdrop-blur rounded-lg p-4 shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-200">
                
                {/* Tooltip Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{zone.id}</div>
                    <div className="font-bold text-slate-800 text-sm">{zone.name}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase text-white ${config.color}`}>
                    {zone.status}
                  </span>
                </div>
                
                {/* Tooltip Metrics */}
                <div className="space-y-3 text-xs">
                  
                  {/* Power Bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Power Output</span>
                      <span className="font-mono font-bold text-slate-700">{zone.power} / {zone.capacity} kW</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${config.color}`} 
                        style={{ width: `${(zone.power / zone.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Module Count (The Sync Link) */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Grid3x3 size={14} className="text-blue-500" />
                      <span>Modules Monitored:</span>
                    </div>
                    {/* Display the EXACT count calculated in mock.js */}
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {zone.moduleCount}
                    </span>
                  </div>

                </div>
              </div>
              {/* End Tooltip */}

            </div>
          );
        })}

      </div>
    </div>
  );
}