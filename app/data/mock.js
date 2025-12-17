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

// MODULE MATRIX (Strings of solar panels)
export const MOCK_MODULES = [
  { 
    id: "STR-A01", 
    status: "normal", 
    panels: Array(20).fill({ v: 33.5, c: 9.1, status: "normal" }) 
  },
  { 
    id: "STR-A02", 
    status: "warning", 
    panels: Array(20).fill(null).map((_, i) => ({ 
      v: i === 4 ? 0 : 33.2, 
      c: i === 4 ? 0 : 9.0, 
      status: i === 4 ? "offline" : "normal" 
    })) 
  },
  { 
    id: "STR-B01", 
    status: "normal", 
    panels: Array(20).fill({ v: 33.4, c: 9.1, status: "normal" }) 
  },
  { 
    id: "STR-B02", 
    status: "error", 
    panels: Array(20).fill(null).map((_, i) => ({ 
      v: i === 15 ? 45.0 : 33.1, 
      c: i === 15 ? 12.0 : 9.0, 
      status: i === 15 ? "fault" : "normal" 
    })) 
  },
  { 
    id: "STR-C01", 
    status: "normal", 
    panels: Array(20).fill({ v: 33.6, c: 9.2, status: "normal" }) 
  },
];

// CCTV CAMERAS
export const MOCK_CAMERAS = [
  { id: "CAM-01", name: "Main Gate", status: "online", url: "https://images.unsplash.com/photo-1562619425-c307bb83bc42?w=800&q=80" },
  { id: "CAM-02", name: "Inverter Room A", status: "online", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
  { id: "CAM-03", name: "PV Field North", status: "online", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" },
  { id: "CAM-04", name: "Substation", status: "offline", url: "" }, // Simulated offline camera
];

// SENSORS (Weather Station & Environment)
export const MOCK_SENSORS = [
  { id: "S-01", name: "Global Irradiance", value: 865, unit: "W/m²", type: "sun", status: "normal", trend: "+12%" },
  { id: "S-02", name: "Module Temp", value: 48.2, unit: "°C", type: "temp", status: "warning", trend: "+5%" }, // Hot panels reduce efficiency
  { id: "S-03", name: "Ambient Temp", value: 32.5, unit: "°C", type: "temp", status: "normal", trend: "+2%" },
  { id: "S-04", name: "Wind Speed", value: 3.4, unit: "m/s", type: "wind", status: "normal", trend: "-10%" },
  { id: "S-05", name: "Humidity", value: 45, unit: "%", type: "water", status: "normal", trend: "0%" },
  { id: "S-06", name: "Rainfall", value: 0, unit: "mm", type: "water", status: "normal", trend: "0%" },
];

// FIELD VIEW (Zone/Area Status)
export const MOCK_FIELD = [
  { id: "ZONE-A", name: "North Field", power: 420, capacity: 500, status: "normal", x: 20, y: 30 },
  { id: "ZONE-B", name: "East Expansion", power: 350, capacity: 600, status: "warning", x: 70, y: 25 },
  { id: "ZONE-C", name: "South Array", power: 100, capacity: 500, status: "offline", x: 30, y: 70 },
  { id: "ZONE-D", name: "Central Roof", power: 280, capacity: 300, status: "normal", x: 65, y: 65 },
];

// ROBOT FLEET
export const MOCK_ROBOTS = [
  { id: "R-01", name: "Cleaner Alpha", type: "cleaning", battery: 85, status: "working", location: "Zone A" },
  { id: "R-02", name: "Cleaner Beta", type: "cleaning", battery: 12, status: "charging", location: "Docking Stn" },
  { id: "R-03", name: "Cleaner Gamma", type: "cleaning", battery: 45, status: "idle", location: "Zone B" },
  { id: "D-01", name: "Inspector X", type: "drone", battery: 92, status: "working", location: "Zone C (Air)" },
  { id: "R-04", name: "Cleaner Delta", type: "cleaning", battery: 0, status: "error", location: "Zone D" },
];
