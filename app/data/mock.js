// --- 1. PHYSICAL LAYER GENERATION (The "Source of Truth") ---

// Generates irregular grid for the Map
const generateZoneMatrix = (rows, cols) => {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // Create holes/irregularities to look realistic
      const isVoid = (r < 2 && c < 5) || (r > rows - 4 && c > cols - 6) || Math.random() > 0.96;
      if (isVoid) {
        row.push(0); 
      } else {
        // Random Status for Map: 98% Normal(1), Warn(2), Fault(3)
        const rand = Math.random();
        let status = 1; 
        if (rand > 0.995) status = 3; 
        else if (rand > 0.98) status = 2; 
        row.push(status);
      }
    }
    matrix.push(row);
  }
  return matrix;
};

// Count exact number of dots (modules) in the grid
const countRealModules = (matrix) => {
  let count = 0;
  matrix.forEach(row => row.forEach(cell => { if (cell !== 0) count++; }));
  return count;
};

// --- THE PHYSICAL ZONES ---
// I create the maps first, because they determine how much hardware I need.
const matrixZ01 = generateZoneMatrix(12, 24); // North Field
const matrixZ02 = generateZoneMatrix(10, 20); // East Array
const matrixZ03 = generateZoneMatrix(14, 28); // South Block
const matrixZ04 = generateZoneMatrix(8, 30);  // West Ext

// Count them immediately
const countZ01 = countRealModules(matrixZ01);
const countZ02 = countRealModules(matrixZ02);
const countZ03 = countRealModules(matrixZ03);
const countZ04 = countRealModules(matrixZ04);

export const MOCK_STATION_MAP = {
  zones: [
    { id: "Z-01", name: "North Field", matrix: matrixZ01 },
    { id: "Z-02", name: "East Array", matrix: matrixZ02 }, 
    { id: "Z-03", name: "South Block", matrix: matrixZ03 }, 
    { id: "Z-04", name: "West Ext", matrix: matrixZ04 }     
  ]
};

// --- 2. ELECTRICAL LAYER GENERATION (Derived from Physical Counts) ---

// This function "builts" the electrical system to match the module count
const generateElectricalData = (zoneId, zoneName, totalModules) => {
  const MODULES_PER_STRING = 20;
  const STRINGS_PER_INVERTER = 8;
  
  const inverters = [];
  const modules = [];

  // 1. Calculate how many strings we need
  const totalStrings = Math.ceil(totalModules / MODULES_PER_STRING);
  // 2. Calculate how many inverters we need for those strings
  const totalInverters = Math.ceil(totalStrings / STRINGS_PER_INVERTER);

  let modulesDistributed = 0;
  let currentStringIndex = 1;

  // 3. Build the Hardware Hierarchy
  for (let i = 1; i <= totalInverters; i++) {
    const invId = `INV-${zoneId.split('-')[1]}-${i.toString().padStart(2, '0')}`; // e.g., INV-01-01
    
    // Create Inverter
    inverters.push({
      id: invId,
      zoneId: zoneId,
      zoneName: zoneName,
      status: Math.random() > 0.95 ? "Warning" : "Normal",
      efficiency: (97 + Math.random() * 2).toFixed(1),
      temp: Math.floor(40 + Math.random() * 20)
    });

    // Assign Strings to this Inverter
    for (let s = 0; s < STRINGS_PER_INVERTER; s++) {
      if (modulesDistributed >= totalModules) break; // Stop if we ran out of modules

      // Determine size of this string (usually 20, but last one takes remainder)
      const remaining = totalModules - modulesDistributed;
      const stringSize = remaining > MODULES_PER_STRING ? MODULES_PER_STRING : remaining;
      
      const strId = `STR-${zoneId.split('-')[1]}-${currentStringIndex.toString().padStart(2, '0')}`;
      
      // Generate Panels for this string
      const panels = Array(stringSize).fill(null).map((_, idx) => ({
        v: (33 + Math.random()).toFixed(1),
        c: (9 + Math.random() * 0.5).toFixed(1),
        status: Math.random() > 0.99 ? "fault" : "normal"
      }));

      modules.push({
        id: strId,
        zoneId: zoneId,
        zoneName: zoneName,
        inverterId: invId,
        status: panels.some(p => p.status === 'fault') ? 'error' : 'normal',
        panels: panels
      });

      modulesDistributed += stringSize;
      currentStringIndex++;
    }
  }

  return { inverters, modules };
};

// GENERATE ALL ELECTRICAL DATA DYNAMICALLY
const elecZ01 = generateElectricalData("Z-01", "North Field", countZ01);
const elecZ02 = generateElectricalData("Z-02", "East Array", countZ02);
const elecZ03 = generateElectricalData("Z-03", "South Block", countZ03);
const elecZ04 = generateElectricalData("Z-04", "West Ext", countZ04);

// EXPORT COMBINED DATA (This is what the UI reads)
export const MOCK_INVERTERS = [
  ...elecZ01.inverters, ...elecZ02.inverters, ...elecZ03.inverters, ...elecZ04.inverters
];

export const MOCK_MODULES = [
  ...elecZ01.modules, ...elecZ02.modules, ...elecZ03.modules, ...elecZ04.modules
];

// --- 3. FIELD VIEW DATA (Synced) ---
export const MOCK_FIELD = [
  { id: "Z-01", name: "North Field", power: 420, capacity: 500, moduleCount: countZ01, status: "normal", x: 20, y: 30 },
  { id: "Z-02", name: "East Array", power: 350, capacity: 600, moduleCount: countZ02, status: "warning", x: 70, y: 25 },
  { id: "Z-03", name: "South Block", power: 100, capacity: 500, moduleCount: countZ03, status: "offline", x: 30, y: 70 },
  { id: "Z-04", name: "West Ext", power: 280, capacity: 300, moduleCount: countZ04, status: "normal", x: 65, y: 65 },
];

// --- 4. STATION OVERVIEW & OTHER MOCK DATA (Static) ---
export const MOCK_STATION_STATUS = {
  power: { value: 450.5, unit: "kW", trend: "up" },
  dailyEnergy: { value: 1250, unit: "kWh" },
  co2: { value: 850, unit: "kg" },
  safetyDays: 124, 
  weather: { temp: 24, condition: "Sunny" }
};
export const MOCK_ANALYSIS_DATA = [
  { time: '06:00', power: 0 }, { time: '08:00', power: 120 }, { time: '10:00', power: 450 },
  { time: '12:00', power: 980 }, { time: '14:00', power: 850 }, { time: '16:00', power: 340 },
  { time: '18:00', power: 50 }, { time: '20:00', power: 0 },
];
export const MOCK_CAMERAS = [
  { id: "CAM-01", name: "Main Gate", status: "online", url: "https://images.unsplash.com/photo-1562619425-c307bb83bc42?w=800&q=80" },
  { id: "CAM-02", name: "Inverter Room A", status: "online", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
  { id: "CAM-03", name: "PV Field North", status: "online", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80" },
  { id: "CAM-04", name: "Substation", status: "offline", url: "" }, 
];
export const MOCK_SENSORS = [
  { id: "S-01", name: "Global Irradiance", value: 865, unit: "W/m²", type: "sun", status: "normal", trend: "+12%" },
  { id: "S-02", name: "Module Temp", value: 48.2, unit: "°C", type: "temp", status: "warning", trend: "+5%" },
  { id: "S-03", name: "Ambient Temp", value: 32.5, unit: "°C", type: "temp", status: "normal", trend: "+2%" },
  { id: "S-04", name: "Wind Speed", value: 3.4, unit: "m/s", type: "wind", status: "normal", trend: "-10%" },
  { id: "S-05", name: "Humidity", value: 45, unit: "%", type: "water", status: "normal", trend: "0%" },
  { id: "S-06", name: "Rainfall", value: 0, unit: "mm", type: "water", status: "normal", trend: "0%" },
];
export const MOCK_ROBOTS = [
  { id: "R-01", name: "Cleaner Alpha", type: "cleaning", battery: 85, status: "working", location: "Zone A" },
  { id: "R-02", name: "Cleaner Beta", type: "cleaning", battery: 12, status: "charging", location: "Docking Stn" },
  { id: "R-03", name: "Cleaner Gamma", type: "cleaning", battery: 45, status: "idle", location: "Zone B" },
  { id: "D-01", name: "Inspector X", type: "drone", battery: 92, status: "working", location: "Zone C (Air)" },
  { id: "R-04", name: "Cleaner Delta", type: "cleaning", battery: 0, status: "error", location: "Zone D" },
];
export const MOCK_EDGE_NODES = [
  { id: "EDGE-01", name: "Gateway North", ip: "192.168.1.101", status: "online", cpu: 45, ram: 60, temp: 42, latency: "12ms" },
  { id: "EDGE-02", name: "Gateway South", ip: "192.168.1.102", status: "online", cpu: 78, ram: 85, temp: 55, latency: "15ms" },
  { id: "EDGE-03", name: "Substation Controller", ip: "192.168.1.200", status: "offline", cpu: 0, ram: 0, temp: 0, latency: "-" },
  { id: "EDGE-04", name: "Met Mast Logger", ip: "192.168.1.50", status: "online", cpu: 12, ram: 30, temp: 38, latency: "45ms" },
];