import React from "react";

export default function StationMap({ data }) {
  if (!data || !data.zones) return null;

  return (
    <div className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-700">Station Topology</h3>
        
        {/* Legend */}
        <div className="flex gap-3 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-sm"></span> Normal
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-sm"></span> Warning
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-sm"></span> Fault
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-white border border-slate-300 rounded-sm"></span> Empty
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-1 gap-6 content-start pr-2 custom-scrollbar">
        {data.zones.map((zone) => (
          <div key={zone.id} className="relative bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="absolute -top-2.5 left-3 bg-white px-2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded shadow-sm">
              {zone.id} — {zone.name}
            </div>
            
            <div className="flex flex-col gap-0.5 mt-2">
              {zone.matrix.map((row, rIndex) => (
                <div key={rIndex} className="flex justify-center gap-0.5">
                  {row.map((cell, cIndex) => {
                    // 1. HANDLE VOIDS (Null)
                    if (!cell) {
                      return (
                        <div 
                          key={`${rIndex}-${cIndex}`} 
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 pointer-events-none"
                        />
                      );
                    }

                    // 2. DETERMINE COLOR BASED ON OBJECT STATUS
                    let colorClass = "bg-green-500 hover:bg-green-400";
                    if (cell.status === 'warning') colorClass = "bg-yellow-400 hover:bg-yellow-300";
                    if (cell.status === 'fault') colorClass = "bg-red-500 hover:bg-red-400 animate-pulse";
                    
                    return (
                      <div 
                        key={`${rIndex}-${cIndex}`} 
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[1px] transition-all cursor-pointer hover:scale-150 hover:shadow-lg hover:z-50 ${colorClass}`} 
                        // 3. ADVANCED TOOLTIP WITH ID
                        title={`${cell.stringId} | ${cell.panelId} (${cell.status.toUpperCase()})`}
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