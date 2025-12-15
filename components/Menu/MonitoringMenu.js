"use client";
import {
  LayoutDashboard,
  Server,
  Zap,
  Activity,
  Radio,
  ShieldCheck,
  Camera,
} from "lucide-react";

/**
 * GROUP 1: Monitoring
 * Blue theme
 * Real-time & physical-layer system views
 */
export const MONITORING_ITEMS = [
  { id: "camera", cn: "实时监控", en: "CCTV", icon: Camera },
  { id: "station", cn: "电站层", en: "STATION STATUS", icon: LayoutDashboard },
  { id: "field", cn: "场区层", en: "FIELD VIEW", icon: Server },
  { id: "inverter", cn: "逆变器层", en: "INVERTER", icon: Zap },
  { id: "module", cn: "组件层", en: "MODULE MATRIX", icon: Activity },
  { id: "sensors", cn: "传感器", en: "SENSORS", icon: Radio },
  { id: "robots", cn: "机器人", en: "ROBOTS", icon: ShieldCheck },
  { id: "edge", cn: "边缘计算点", en: "EDGE NODES", icon: Server },
];

export default function MonitoringMenu({ activeTab, setActiveTab }) {
  return (
    <>
      {MONITORING_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 flex items-center
              border-b border-gray-50 transition-all duration-200
              ${isActive ? "btn-monitoring-active" : "btn-monitoring"}`}
          >
            <item.icon size={18} className="mr-3 opacity-80" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">{item.cn}</span>
              <span className="text-[10px] uppercase opacity-70">
                {item.en}
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}
