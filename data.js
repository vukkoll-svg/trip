// Probni (mock) podaci — u pravoj verziji ovo stiže iz API-ja
// (Travelpayouts/Aviasales za letove, Hotellook za hotele).
// Cene: povratni let po osobi (EUR) i hotel po noći za dvoje (EUR),
// avgMarket = prosečna tržišna cena istog paketa (za poređenje).

const DESTINATIONS = [
  { city: "Barselona",  code: "BCN", gradient: ["#f97316", "#ef4444"], flight: 89,  hotelNight: 74, avgMarketFactor: 1.28 },
  { city: "Rim",        code: "FCO", gradient: ["#eab308", "#d97706"], flight: 62,  hotelNight: 68, avgMarketFactor: 1.22 },
  { city: "Atina",      code: "ATH", gradient: ["#0ea5e9", "#2563eb"], flight: 74,  hotelNight: 55, avgMarketFactor: 1.18 },
  { city: "Istanbul",   code: "IST", gradient: ["#dc2626", "#7c2d12"], flight: 58,  hotelNight: 49, avgMarketFactor: 1.25 },
  { city: "Prag",       code: "PRG", gradient: ["#8b5cf6", "#6d28d9"], flight: 55,  hotelNight: 61, avgMarketFactor: 1.15 },
  { city: "Lisabon",    code: "LIS", gradient: ["#14b8a6", "#0f766e"], flight: 118, hotelNight: 66, avgMarketFactor: 1.31 },
  { city: "Malta",      code: "MLA", gradient: ["#f59e0b", "#b45309"], flight: 96,  hotelNight: 58, avgMarketFactor: 1.2  },
  { city: "Budimpešta", code: "BUD", gradient: ["#22c55e", "#15803d"], flight: 38,  hotelNight: 52, avgMarketFactor: 1.12 },
  { city: "Pariz",      code: "CDG", gradient: ["#64748b", "#334155"], flight: 104, hotelNight: 92, avgMarketFactor: 1.24 },
  { city: "Larnaka",    code: "LCA", gradient: ["#06b6d4", "#0369a1"], flight: 87,  hotelNight: 50, avgMarketFactor: 1.19 },
  { city: "Milano",     code: "MXP", gradient: ["#a855f7", "#7e22ce"], flight: 49,  hotelNight: 71, avgMarketFactor: 1.16 },
  { city: "Valensija",  code: "VLC", gradient: ["#fb7185", "#e11d48"], flight: 101, hotelNight: 57, avgMarketFactor: 1.27 },
];

// Koeficijent cene leta po polaznom aerodromu (BEG je referenca)
const ORIGIN_FACTOR = { BEG: 1.0, INI: 0.88, TSR: 0.79, SOF: 0.92 };

// Sezonski koeficijent po mesecu (septembar je referenca)
const MONTH_FACTOR = { 8: 1.35, 9: 1.0, 10: 0.85, 11: 0.72 };
