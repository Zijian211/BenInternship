"use client";
import React from "react";
import { 
  Sun, Thermometer, Wind, Droplets, 
  Info, AlertTriangle, Activity 
} from "lucide-react";

export default function SensorCard({ data }) {
  // If data is missing or empty, show loading
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Activity size={48} className="mb-4 opacity-20 animate-pulse" />
        <p>Waiting for Met Station Data...</p>
      </div>
    );
  }

  // Safely find sensors without crashing
  const getSensor = (searchTerm) => {
    return data.find(s => s.name?.includes(searchTerm)) || { 
      value: 0, unit: '-', zoneId: 'N/A', status: 'unknown' 
    };
  };

  // --- EXTRACT SENSORS BY TYPE ---
  const ghi = getSensor("Global");
  const poa = getSensor("Array");
  const modTemp = getSensor("Module");
  const ambTemp = getSensor("Ambient");
  const wind = getSensor("Wind");
  const humidity = getSensor("Humidity");

  // --- CALCULATE REAL-WORLD IMPACT ---
  // Default to 25°C if data is missing to prevent NaN errors
  const currentModTemp = modTemp.value || 25;
  const currentAmbTemp = ambTemp.value || 25;
  
  // Solar panels lose ~0.39% efficiency for every degree above 25°C
  const tempDiff = currentModTemp - 25;
  // Ensure we don't show negative loss if temp is below 25
  const efficiencyLoss = tempDiff > 0 ? (tempDiff * 0.39).toFixed(2) : "0.00"; 

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. HERO SECTION: IRRADIANCE -- THE FUEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Irradiance Card */}
        <div className="col-span-1 lg:col-span-2 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Sun size={120} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-orange-100 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <Sun size={16} /> Solar Irradiance (POA)
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-6xl font-black">{poa.value}</span>
              <span className="text-xl font-medium opacity-80">{poa.unit}</span>
            </div>
            <p className="mt-2 text-orange-100 text-sm max-w-md">
              Current solar energy hitting the panel surface. This is the maximum theoretical energy available for conversion.
            </p>

            <div className="mt-8 flex gap-8">
              <div>
                <div className="text-xs text-orange-200 uppercase font-bold">GHI (Horizontal)</div>
                <div className="text-xl font-bold">{ghi.value} {ghi.unit}</div>
              </div>
              <div>
                 <div className="text-xs text-orange-200 uppercase font-bold">Reference Cell</div>
                 <div className="text-xl font-bold">Normal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Impact Card -- Calculated Logic */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Thermal Loss Factor
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Real-time efficiency loss due to heat.
            </p>
          </div>

          <div className="my-4 text-center">
             <div className="text-4xl font-black text-red-500">-{efficiencyLoss}%</div>
             <div className="text-xs text-slate-400 font-mono mt-1">Power Output Penalty</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            <div className="flex justify-between mb-1">
              <span>Module Temp:</span>
              <span className="font-bold">{currentModTemp}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Ambient Temp:</span>
              <span className="font-bold">{currentAmbTemp}°C</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
               {/* Clamp the bar width so it doesn't break layout */}
               <div className="bg-red-500 h-full" style={{ width: `${Math.min(tempDiff * 2, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module Temperature */}
        <SensorDetailCard 
          icon={Thermometer} 
          color="text-red-500" 
          bg="bg-red-50"
          label={modTemp.name || "Module Temp"} 
          value={modTemp.value} 
          unit={modTemp.unit}
          sub="Critical for Inverter efficiency"
        />

        {/* Ambient Temperature */}
        <SensorDetailCard 
          icon={Thermometer} 
          color="text-blue-500" 
          bg="bg-blue-50"
          label={ambTemp.name || "Ambient Temp"} 
          value={ambTemp.value} 
          unit={ambTemp.unit}
          sub="Baseline environment"
        />

        {/* Wind Speed */}
        <SensorDetailCard 
          icon={Wind} 
          color="text-slate-600" 
          bg="bg-slate-100"
          label={wind.name || "Wind Speed"} 
          value={wind.value} 
          unit={wind.unit}
          sub={wind.value > 12 ? "Warning: High Wind" : "Safe for Operations"}
          alert={wind.value > 12}
        />

        {/* Humidity */}
        <SensorDetailCard 
          icon={Droplets} 
          color="text-blue-400" 
          bg="bg-blue-50"
          label={humidity.name || "Humidity"} 
          value={humidity.value} 
          unit={humidity.unit}
          sub="PID Risk Factor: Low"
        />

      </div>

      {/* 3. LOGICAL CONNECTION FOOTER */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
        <div>
           <h5 className="font-bold text-blue-800 text-sm">System Connection Insight</h5>
           <p className="text-xs text-blue-600 mt-1">
             The current <strong>Irradiance of {poa.value} W/m²</strong> in Zone {poa.zoneId} suggests the Inverters in "North Field" should be operating at approx <strong>85% capacity</strong>. 
             However, the high <strong>Module Temperature ({currentModTemp}°C)</strong> is causing a <strong>{efficiencyLoss}% efficiency drag</strong>.
           </p>
        </div>
      </div>

    </div>
  );
}

// Sub-component for clean cards
function SensorDetailCard({ icon: Icon, color, bg, label, value, unit, sub, alert }) {
  return (
    <div className={`bg-white p-5 rounded-xl border ${alert ? 'border-red-500 animate-pulse' : 'border-slate-200'} shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon size={20} />
        </div>
        {alert && <AlertTriangle size={16} className="text-red-500" />}
      </div>
      <div className="text-2xl font-bold text-slate-800">
        {value} <span className="text-sm text-slate-400 font-medium">{unit}</span>
      </div>
      <div className="font-medium text-slate-600 text-sm mt-1">{label}</div>
      <div className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-2">
        {sub}
      </div>
    </div>
  );
}