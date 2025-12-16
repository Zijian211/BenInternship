"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function StationPowerChart({ data }) {
  // Guard clause: If no data is passed, show a safe empty state
  if (!data || data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-gray-400">No Chart Data</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-96">
      <h3 className="text-lg font-bold text-gray-800 mb-4">24h Power Generation Trend</h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#9ca3af'}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#9ca3af'}} 
              unit=" kW"
            />
            <Tooltip 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
            />
            <Area 
              type="monotone" 
              dataKey="power" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPower)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}