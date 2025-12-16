// STATION STATUS (KPIs for the main dashboard)
export const MOCK_STATION_STATUS = {
  power: { value: 450.5, unit: "kW", trend: "up" },
  dailyEnergy: { value: 1250, unit: "kWh" },
  co2: { value: 850, unit: "kg" },
  safetyDays: 124, // Days without accidents
  weather: { temp: 24, condition: "Sunny" }
};

// DATA ANALYSIS (For Recharts - 24h Power Generation)
export const MOCK_ANALYSIS_DATA = [
  { time: '06:00', power: 0 },
  { time: '08:00', power: 120 },
  { time: '10:00', power: 450 },
  { time: '12:00', power: 980 },
  { time: '14:00', power: 850 },
  { time: '16:00', power: 340 },
  { time: '18:00', power: 50 },
  { time: '20:00', power: 0 },
];

// INVERTER LIST (Status of hardware)
export const MOCK_INVERTERS = [
  { id: "INV-001", status: "Normal", efficiency: 98.5, temp: 42 },
  { id: "INV-002", status: "Warning", efficiency: 92.1, temp: 58 }, // Overheating
  { id: "INV-003", status: "Normal", efficiency: 98.2, temp: 41 },
  { id: "INV-004", status: "Offline", efficiency: 0, temp: 20 },
];