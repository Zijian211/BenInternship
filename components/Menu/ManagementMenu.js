"use client";
import { Search, BarChart3, Activity, Camera } from "lucide-react";

/**
 * GROUP 2: Management
 * Grey theme
 * Logical / analytical system views
 */
export const MANAGEMENT_ITEMS = [
  { id: "inspection", cn: "巡检作业", en: "INSPECTION", icon: Search },
  { id: "analysis", cn: "数据分析", en: "DATA ANALYSIS", icon: BarChart3 },
  { id: "smart_om", cn: "智能运维", en: "SMART O&M", icon: Activity },
  { id: "market", cn: "市场监控", en: "MARKET MONITOR", icon: Camera },
];

export default function ManagementMenu({ activeTab, setActiveTab }) {
  return (
    <div
      /**
       * ADD SEPARATION:
       * Management group is visually separated from Monitoring group
       */
      className="mt-6 border-t border-gray-100 pt-1"
    >
      {MANAGEMENT_ITEMS.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 flex items-center
              border-b border-gray-50 transition-all duration-200
              ${isActive ? "btn-management-active" : "btn-management"}`}
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
    </div>
  );
}
