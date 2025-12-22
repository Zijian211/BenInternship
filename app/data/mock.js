// --- 1. CONFIGURATION (RENAMED FOR GEOGRAPHIC ACCURACY) ---
const ZONES = {
  Z01: { id: "Z-01", name: "North-West Field", capacity: 500, rows: 12, cols: 24, invCount: 2 }, 
  Z02: { id: "Z-02", name: "North-East Field", capacity: 500, rows: 12, cols: 24, invCount: 2 },
  Z03: { id: "Z-03", name: "South-West Field",  capacity: 300, rows: 10, cols: 20, invCount: 3 },
  Z04: { id: "Z-04", name: "South-East Field",    capacity: 200, rows: 8,  cols: 18, invCount: 2 }
};

// --- 2. PHYSICS ENGINE ---
const calculatePowerOutput = (capacityKw, irradiance, temp, isOffline = false) => {
  if (isOffline) return 0; 
  const sunFactor = irradiance / 1000; 
  const heatLoss = temp > 25 ? (temp - 25) * 0.004 : 0; 
  const systemEff = 0.96;
  let output = capacityKw * sunFactor * (1 - heatLoss) * systemEff;
  return Math.max(0, parseFloat(output.toFixed(1)));
};

// --- 3. FIELD CONDITIONS ---
const CONDITIONS = [
  { zone: ZONES.Z01, irradiance: 950, temp: 32, wind: 5.5 },
  { zone: ZONES.Z02, irradiance: 960, temp: 68, wind: 1.2 },
  { zone: ZONES.Z03, irradiance: 350, temp: 24, wind: 8.0 },
  { zone: ZONES.Z04, irradiance: 880, temp: 29, wind: 4.5 },
];

// --- 4. MAP & ID GENERATOR ---
const generateZoneData = (zoneConfig, temp) => {
  const { rows, cols, id } = zoneConfig;
  const matrix = [];
  const flatModules = []; 
  
  let moduleCounter = 0;
  const panelsPerString = 20;

  // Base Status Logic
  let baseStatus = "normal";
  if (temp > 60) baseStatus = "warning"; // Overheating Zone
  if (id === "Z-04") baseStatus = "fault"; // Broken Zone

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      
      // VOID LOGIC
      const isCornerCut = (r < 2 && c < 3) || (r > rows - 3 && c > cols - 4);
      const isCentralRoad = (c === Math.floor(cols / 2)); 
      const isRandomVoid = Math.random() > 0.97; // 3% random gaps

      if (isCornerCut || isCentralRoad || isRandomVoid) {
        row.push(null); 
      } else {
        // MODULE LOGIC
        moduleCounter++;
        
        // Assign IDs
        const currentStringNum = Math.ceil(moduleCounter / panelsPerString);
        const panelNumInString = ((moduleCounter - 1) % panelsPerString) + 1;
        
        const stringId = `STR-${id.split('-')[1]}-${currentStringNum.toString().padStart(2, '0')}`;
        const panelId = `P-${panelNumInString.toString().padStart(2, '0')}`;
        const uniqueKey = `${stringId}-${panelId}`;

        // Random Fault Injection (1% chance)
        const isRandomBroken = Math.random() > 0.99; 
        let status = baseStatus;
        if (baseStatus !== "fault" && isRandomBroken) status = "fault";

        const cellData = {
          type: "module",
          status: status,
          stringId: stringId,
          panelId: panelId,
          key: uniqueKey,
          v: baseStatus === "fault" ? 0 : (32 + Math.random()).toFixed(1), 
          c: baseStatus === "fault" ? 0 : 9.1
        };

        row.push(cellData);
        flatModules.push(cellData);
      }
    }
    matrix.push(row);
  }
  return { matrix, flatModules, moduleCount: moduleCounter };
};

// --- 5. EXECUTE GENERATION ---
const PROCESSED_ZONES = CONDITIONS.map(c => {
  const data = generateZoneData(c.zone, c.temp);
  return { ...c, ...data };
});

// --- 6. EXPORTS ---

// A. SENSORS
export const MOCK_SENSORS = CONDITIONS.flatMap(c => [
  { id: `S-IRR-${c.zone.id.split('-')[1]}`, zoneId: c.zone.id, name: `Irradiance (${c.zone.name})`, type: "Irradiance", value: c.irradiance, unit: "W/m²", status: "normal" },
  { id: `S-TMP-${c.zone.id.split('-')[1]}`, zoneId: c.zone.id, name: `Module Temp (${c.zone.name})`, type: "Temp", value: c.temp, unit: "°C", status: c.temp > 60 ? "warning" : "normal" },
]);

// B. INVERTERS (FIX: ADDED VARIANCE "JITTER")
export const MOCK_INVERTERS = PROCESSED_ZONES.flatMap(z => {
  const count = z.zone.invCount;
  const isZoneDead = z.zone.id === "Z-04"; 
  const invCapacity = z.zone.capacity / count;
  const zonePower = calculatePowerOutput(z.zone.capacity, z.irradiance, z.temp, isZoneDead);
  
  // Base power per inverter
  const baseInvPower = zonePower / count;

  return Array(count).fill(null).map((_, i) => {
    // 1. ADD RANDOM VARIANCE (± 1-2%)
    const jitter = isZoneDead ? 0 : (Math.random() * 4 - 2);
    const finalPower = Math.max(0, parseFloat((baseInvPower + jitter).toFixed(1)));
    
    // 2. Temperature Variance
    const tempJitter = isZoneDead ? 0 : (Math.random() * 2 - 1);
    
    return {
      id: `INV-${z.zone.id.split('-')[1]}-0${i+1}`, 
      zoneId: z.zone.id,
      zoneName: z.zone.name,
      capacity: parseFloat(invCapacity.toFixed(0)),
      currentPower: finalPower,
      efficiency: isZoneDead ? 0 : (z.temp > 60 ? 94.5 : 98.2), 
      temp: parseFloat((isZoneDead ? 20 : z.temp + 5 + tempJitter).toFixed(1)),
      status: isZoneDead ? "Offline" : (z.temp > 60 ? "Warning" : "Normal")
    };
  });
});

// C. MODULE STRINGS
export const MOCK_MODULES = PROCESSED_ZONES.flatMap(z => {
  const stringsMap = {};
  
  z.flatModules.forEach(m => {
    if (!stringsMap[m.stringId]) {
      // Distribute strings among available inverters
      const stringNum = parseInt(m.stringId.split('-')[2]);
      const invIndex = (stringNum - 1) % z.zone.invCount;
      const assignedInvId = `INV-${z.zone.id.split('-')[1]}-0${invIndex + 1}`;

      stringsMap[m.stringId] = {
        id: m.stringId,
        inverterId: assignedInvId,
        zoneId: z.zone.id,
        zoneName: z.zone.name,
        status: "normal", 
        panels: []
      };
    }
    stringsMap[m.stringId].panels.push(m);
  });

  return Object.values(stringsMap).map(str => {
    if (str.zoneId === "Z-04") {
      str.status = "fault";
      return str;
    }
    const hasFault = str.panels.some(p => p.status === 'fault');
    const hasWarning = str.panels.some(p => p.status === 'warning');
    if (hasFault) str.status = "fault";
    else if (hasWarning) str.status = "warning";
    else str.status = "normal";
    return str;
  });
});

// D. STATION MAP
export const MOCK_STATION_MAP = {
  zones: PROCESSED_ZONES.map(z => ({
    id: z.zone.id, 
    name: z.zone.name,
    matrix: z.matrix
  }))
};

// E. FIELD SUMMARY (COORDINATE MATCHING)
export const MOCK_FIELD = PROCESSED_ZONES.map(z => {
  const isZoneDead = z.zone.id === "Z-04";
  return {
    id: z.zone.id,
    name: z.zone.name,
    power: calculatePowerOutput(z.zone.capacity, z.irradiance, z.temp, isZoneDead),
    capacity: z.zone.capacity,
    moduleCount: z.moduleCount,
    status: isZoneDead ? "offline" : (z.temp > 60 ? "warning" : "normal"),
    x: z.zone.id === 'Z-01' ? 20 : z.zone.id === 'Z-02' ? 70 : z.zone.id === 'Z-03' ? 30 : 65,
    y: z.zone.id === 'Z-01' ? 30 : z.zone.id === 'Z-02' ? 25 : z.zone.id === 'Z-03' ? 70 : 65,
  };
});

// --- 7. STATION OVERVIEW & OTHER MOCK DATA (Static) ---
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