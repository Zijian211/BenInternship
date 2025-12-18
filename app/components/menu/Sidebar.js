import React, { useState } from "react";
import { 
  Video, Camera, 
  LayoutDashboard, Map, Zap, Grid3x3, Wind, Bot, Server, 
  ClipboardCheck, BarChart3, Stethoscope, TrendingUp, 
  ChevronDown, ChevronRight 
} from "lucide-react";

// Define the MENU STRUCTURE
const MENU_STRUCTURE = [
  {
    id: "cctv_parent",
    label: "实时监控",
    subLabel: "REAL-TIME MONITORING",
    icon: Video,
    type: "parent",
    children: [
      { id: "station", label: "电站层", sub: "STATION LAYER", icon: LayoutDashboard },
      { id: "field", label: "场区层", sub: "FIELD VIEW", icon: Map },
      { id: "inverter", label: "逆变器层", sub: "INVERTER", icon: Zap },
      { id: "module", label: "组件层", sub: "MODULE MATRIX", icon: Grid3x3 },
      { id: "sensors", label: "传感器", sub: "SENSORS", icon: Wind },
      { id: "robots", label: "机器人", sub: "ROBOTS", icon: Bot },
      { id: "edge", label: "边缘计算点", sub: "EDGE NODES", icon: Server },
      { id: "camera", label: "摄像头", sub: "CAMERA", icon: Camera },
    ]
  },
  { id: "inspection", label: "巡检作业", subLabel: "INSPECTION", icon: ClipboardCheck, type: "link" },
  { id: "analysis", label: "数据分析", subLabel: "DATA ANALYSIS", icon: BarChart3, type: "link" },
  { id: "smart_om", label: "智能运维", subLabel: "SMART O&M", icon: Stethoscope, type: "link" },
  { id: "market", label: "市场监控", subLabel: "MARKET MONITOR", icon: TrendingUp, type: "link" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isCctvOpen, setIsCctvOpen] = useState(true);

  const isMainActive = (item) => {
    if (item.type === 'link') return activeTab === item.id;
    if (item.type === 'parent') {
      return item.children.some(child => child.id === activeTab);
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {MENU_STRUCTURE.map((item) => (
        <div key={item.id}>
          
          {/* MAIN BUTTON */}
          <button
            onClick={() => {
              if (item.type === 'parent') setIsCctvOpen(!isCctvOpen);
              else setActiveTab(item.id);
            }}
            className={`btn-main ${isMainActive(item) ? 'btn-main-active' : ''}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <div className="flex flex-col items-start">
                <span className="text-sm leading-none">{item.label}</span>
                <span className="text-[10px] font-normal opacity-70">{item.subLabel}</span>
              </div>
            </div>
            {item.type === 'parent' && (
              <div className="text-slate-400">
                {isCctvOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            )}
          </button>

          {/* SUB-MENU ITEMS */}
          {item.type === 'parent' && isCctvOpen && (
            <div className="flex flex-col gap-1 mt-1 animate-in slide-in-from-top-2 duration-200">
              {item.children.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`btn-sub ${activeTab === sub.id ? 'btn-sub-active' : ''}`}
                >
                  <sub.icon size={16} className="mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="leading-none">{sub.label}</span>
                    <span className="text-[9px] uppercase opacity-70 tracking-wider mt-0.5">{sub.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Export a helper to find the current item details for the Header
export const getItemDetails = (id) => {
  for (const item of MENU_STRUCTURE) {
    if (item.id === id) return { cn: item.label, en: item.subLabel, icon: item.icon };
    if (item.children) {
      const child = item.children.find(c => c.id === id);
      if (child) return { cn: child.label, en: child.sub, icon: child.icon };
    }
  }
  return { cn: "EMS", en: "SYSTEM", icon: Video };
};