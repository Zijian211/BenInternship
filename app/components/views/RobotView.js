import React from "react";
import { Battery, BatteryCharging, Bot, Plane, AlertCircle } from "lucide-react";

export default function RobotView({ data }) {
  if (!data) return null;

  // Battery Color
  const getBatteryColor = (level) => {
    if (level > 60) return "bg-green-500";
    if (level > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Autonomous Fleet</h3>
          <p className="text-sm text-slate-400">Cleaning Robots & Inspection Drones</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-blue-700">Fleet Online</span>
        </div>
      </div>

      {/* Robot List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((robot) => (
          <div key={robot.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            
            {/* Status Indicator Stripe */}
            <div className={`absolute top-0 left-0 bottom-0 w-1 ${
              robot.status === 'error' ? 'bg-red-500' : 
              robot.status === 'working' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>

            <div className="pl-3">
              {/* Top Row: Icon and ID */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    {robot.type === 'drone' ? <Plane size={24} /> : <Bot size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">{robot.name}</h4>
                    <span className="text-xs font-mono text-slate-400">{robot.id}</span>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                  robot.status === 'working' ? 'bg-green-50 border-green-200 text-green-700' :
                  robot.status === 'charging' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  robot.status === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  {robot.status}
                </span>
              </div>

              {/* Location Info */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded">
                 <span className="font-semibold">Current Location:</span>
                 <span className="font-mono text-slate-700">{robot.location}</span>
              </div>

              {/* Battery Section */}
              <div className="mt-2">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                    {robot.status === 'charging' ? <BatteryCharging size={14}/> : <Battery size={14}/>}
                    Battery
                  </div>
                  <span className="text-sm font-bold text-slate-800">{robot.battery}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${getBatteryColor(robot.battery)}`} 
                    style={{ width: `${robot.battery}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}