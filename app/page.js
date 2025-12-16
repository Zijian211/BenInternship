"use client";
import React, { useState } from "react";
import MonitoringMenu, {
  MONITORING_ITEMS,
} from "./components/menu/MonitoringMenu";
import ManagementMenu, {
  MANAGEMENT_ITEMS,
} from "./components/menu/ManagementMenu";

const ALL_ITEMS = [...MONITORING_ITEMS, ...MANAGEMENT_ITEMS];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("station");

  // Helper to find current item details
  const currentItem =
    ALL_ITEMS.find((item) => item.id === activeTab) || ALL_ITEMS[0];

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 overflow-hidden">

      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-xl shrink-0">

        {/* LOGO AREA */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="font-bold text-xl text-blue-900">EMS SYSTEM</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <MonitoringMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <ManagementMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </aside>

      {/* --- RIGHT CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">

        <header className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6">
          <h2 className="text-lg font-bold text-gray-800">
            {currentItem.cn}
            <span className="ml-2 text-sm text-gray-400 font-normal">
              {currentItem.en}
            </span>
          </h2>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
          <currentItem.icon size={64} className="mb-4 opacity-20" />
          <p className="text-xl font-medium">
            {currentItem.cn} Content Loading...
          </p>
        </div>
      </main>
    </div>
  );
}
