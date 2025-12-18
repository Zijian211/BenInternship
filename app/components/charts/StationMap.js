import React from "react";

export default function StationMap({ data }) {
  if (!data || !data.zones) return null;

  return (
    <div className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-700">Station Topology</h3>
        
        {/* Legend */}
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-sm"></span> Normal</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-sm"></span> Low Eff</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-sm"></span> Fault</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-sm"></span> No PV Moudles</div>
        </div>
      </div>

      {/* The 4 Zones Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 gap-6 content-start">
        {data.zones.map((zone) => (
          <div key={zone.id} className="relative bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur text-[10px] font-bold text-slate-500 rounded shadow-sm border border-slate-200">
              {zone.name}
            </div>
            
            {/* The Matrix Visualization */}
            <div className="flex flex-col gap-0.5 mt-6">
              {zone.matrix.map((row, rIndex) => (
                <div key={rIndex} className="flex justify-center gap-0.5">
                  {row.map((cell, cIndex) => {
                    // Determine Color based on Status Code
                    let colorClass = "opacity-0 pointer-events-none";
                    
                    if (cell === 1) colorClass = "bg-green-500 hover:bg-green-400 cursor-pointer";
                    if (cell === 2) colorClass = "bg-yellow-400 hover:bg-yellow-300 cursor-pointer";
                    if (cell === 3) colorClass = "bg-red-500 hover:bg-red-400 cursor-pointer animate-pulse";
                    
                    return (
                      <div 
                        key={`${rIndex}-${cIndex}`} 
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[1px] transition-colors ${colorClass}`} 
                        // Only show title if cell is NOT 0 (empty)
                        title={cell !== 0 ? `R${rIndex}:C${cIndex} - ${cell === 3 ? 'FAULT' : 'OK'}` : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}