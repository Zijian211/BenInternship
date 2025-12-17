import React from "react";

export default function ModuleMatrixView({ data }) {
  // Immediate exit if data is missing or not an array
  if (!data || !Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No Module Data Available</p>
      </div>
    );
  }

  // Get color based on panel status
  const getPanelStyle = (status) => {
    switch (status) {
      case "normal": return "bg-blue-500 hover:bg-blue-600 border-blue-600";
      case "offline": return "bg-gray-300 hover:bg-gray-400 border-gray-400";
      case "fault": return "bg-red-500 hover:bg-red-600 border-red-600 animate-pulse";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
      
      {/* Header Legend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h3 className="font-bold text-lg text-slate-800">PV Module Matrix</h3>
           <p className="text-sm text-slate-400">Real-time voltage monitoring per string</p>
        </div>
        
        <div className="flex gap-4 text-xs font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Normal</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Fault/Overheat</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-300 rounded-sm"></span> Offline</div>
        </div>
      </div>

      {/* The Matrix Grid */}
      <div className="space-y-6">
        {data.map((stringRow, index) => {
          // Skip this row if it is malformed
          if (!stringRow) return null;

          return (
            <div key={stringRow.id || index} className="flex flex-col md:flex-row gap-4 items-start md:items-center group">
              
              {/* String Label (Left Side) */}
              <div className="w-28 shrink-0 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2">
                <span className="font-bold text-slate-700 text-sm">{stringRow.id || "Unknown"}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  stringRow.status === 'normal' ? 'bg-green-100 text-green-700' : 
                  stringRow.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stringRow.status || "N/A"}
                </span>
              </div>

              {/* Panels (Right Side) */}
              <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="grid grid-cols-10 md:grid-cols-20 gap-1.5">
                  
                  {/* The (?) and (|| []) prevent the crash */}
                  {(stringRow.panels || []).map((panel, idx) => (
                    <div
                      key={idx}
                      title={panel ? `Panel #${idx + 1}\nVoltage: ${panel.v}V` : "No Data"}
                      className={`h-6 md:h-8 rounded-sm cursor-help transition-all border-b-2 ${getPanelStyle(panel?.status)}`}
                    />
                  ))}
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}