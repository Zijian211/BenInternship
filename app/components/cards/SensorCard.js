import React from "react";
import { Sun, Wind, Thermometer, Droplets, CloudRain, Activity } from "lucide-react";

export default function SensorCard({ data }) {
  if (!data) return null;

  // Helper to get Icon based on sensor type
  const getIcon = (type) => {
    switch (type) {
      case "sun": return <Sun size={24} />;
      case "wind": return <Wind size={24} />;
      case "temp": return <Thermometer size={24} />;
      case "water": return <Droplets size={24} />;
      default: return <Activity size={24} />;
    }
  };

  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "warning": return "bg-orange-50 border-orange-200 text-orange-700";
      case "error": return "bg-red-50 border-red-200 text-red-700";
      default: return "bg-blue-50 border-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Environmental Sensors</h3>
          <p className="text-sm text-slate-400">Meteorological Station Data (Met Mast)</p>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Signal: Strong
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((sensor) => (
          <div key={sensor.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${getStatusColor(sensor.status)}`}>
                {getIcon(sensor.type)}
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                sensor.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {sensor.status}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">{sensor.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{sensor.value}</span>
                <span className="text-sm font-medium text-slate-500">{sensor.unit}</span>
              </div>
            </div>

            {/* Simulated Trend Line */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs text-slate-400">Device ID: {sensor.id}</span>
              <span className="text-xs font-medium text-blue-600">{sensor.trend} vs 1h ago</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}