// Trip backend — bez zavisnosti, Node 18+
// Pokretanje: node server.js  →  http://localhost:3000
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { DESTINATIONS } from "./destinations.js";

// --- .env ---
const ENV = {};
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) ENV[m[1]] = m[2].trim();
  }
}
const TP_TOKEN = ENV.TRAVELPAYOUTS_TOKEN;
const TP_MARKER = ENV.TRAVELPAYOUTS_MARKER;
const LITEAPI_KEY = ENV.LITEAPI_KEY;

// --- jednostavan keš u memoriji (TTL 6h) da ne trošimo API limite ---
const cache = new Map();
const TTL = 6 * 60 * 60 * 1000;
async function cached(key, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  const v = await fn();
  if (v != null) cache.set(key, { v, t: Date.now() }); // neuspehe ne keširamo
  return v;
}

// --- Aviasales: najjeftiniji povratni let u mesecu, trajanje ~nights ---
async function pricesForDates(origin, dest, month, oneWay) {
  const url =
    `https://api.travelpayouts.com/aviasales/v3/prices_for_dates` +
    `?origin=${origin}&destination=${dest}&departure_at=${month}` +
    `&one_way=${oneWay}&currency=eur&sorting=price&limit=30&token=${TP_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()).data ?? [];
}

async function cheapestFlight(origin, dest, month, nights) {
  return cached(`f:${origin}:${dest}:${month}:${nights}`, async () => {
    const roundTrips = await pricesForDates(origin, dest, month, false);
    // 1. povratna karta sa trajanjem ~nights (±2)
    const match = roundTrips.find((o) => {
      if (!o.return_at) return false;
      const days = Math.round(
        (new Date(o.return_at) - new Date(o.departure_at)) / 86400000
      );
      return Math.abs(days - nights) <= 2;
    });
    const offer = match || roundTrips[0];
    if (offer?.return_at) {
      return {
        pricePerPerson: offer.price,
        airline: offer.airline,
        departureAt: offer.departure_at.slice(0, 10),
        returnAt: offer.return_at.slice(0, 10),
        transfers: offer.transfers,
        link: `https://www.aviasales.com${offer.link}&marker=${TP_MARKER}`,
      };
    }
    // 2. rezerva: dva jednosmerna leta (keš često nema povratne za manje rute)
    const [out, back] = await Promise.all([
      pricesForDates(origin, dest, month, true),
      pricesForDates(dest, origin, month, true),
    ]);
    let best = null;
    for (const o of out) {
      const dep = o.departure_at.slice(0, 10);
      for (const b of back) {
        const ret = b.departure_at.slice(0, 10);
        const days = Math.round((new Date(ret) - new Date(dep)) / 86400000);
        if (Math.abs(days - nights) > 2 || days < 1) continue;
        const price = o.price + b.price;
        if (!best || price < best.pricePerPerson) {
          best = {
            pricePerPerson: price,
            airline: o.airline,
            departureAt: dep,
            returnAt: ret,
            transfers: Math.max(o.transfers, b.transfers),
            link: `https://www.aviasales.com${o.link}&marker=${TP_MARKER}`,
          };
        }
      }
    }
    return best;
  });
}

// --- liteAPI: najjeftiniji hotel u gradu za konkretne datume ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cheapestHotel(hotelCity, country, checkin, checkout) {
  return cached(`h:${hotelCity}:${checkin}:${checkout}`, async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await sleep(1000 * attempt);
      const result = await hotelRates(hotelCity, country, checkin, checkout);
      if (result) return result;
    }
    return null;
  });
}

async function hotelRates(hotelCity, country, checkin, checkout) {
  const res = await fetch("https://api.liteapi.travel/v3.0/hotels/rates", {
      method: "POST",
      headers: { "X-API-Key": LITEAPI_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        cityName: hotelCity,
        countryCode: country,
        checkin,
        checkout,
        occupancies: [{ adults: 2 }],
        currency: "EUR",
        guestNationality: "RS",
        limit: 20,
        minReviewsCount: 50,
      }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const hotels = body.hotels ?? [];
    const rates = body.data ?? [];
    if (!rates.length) return null;
    // minimalna ukupna cena po hotelu
    const offers = rates
      .map((r) => {
        const total = r.roomTypes?.[0]?.offerRetailRate?.amount;
        const hotel = hotels.find((h) => h.id === r.hotelId);
        return total && hotel
          ? { total: Math.round(total), name: hotel.name, stars: hotel.stars, rating: hotel.rating }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.total - b.total);
    if (!offers.length) return null;
    const avg = Math.round(offers.reduce((s, o) => s + o.total, 0) / offers.length);
    return { best: offers[0], avgTotal: avg, offersCount: offers.length };
}

// ograničen paralelizam — sandbox API-ji ne vole 12 istovremenih poziva
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]);
      }
    })
  );
  return results;
}

// --- glavna ruta: kombinovani paketi ---
async function getDeals({ origin, month, nights, budget }) {
  const results = await mapLimit(DESTINATIONS, 4, async (d) => {
      try {
        const flight = await cheapestFlight(origin, d.iata, month, nights);
        if (!flight?.returnAt) {
          console.log(`[deals] ${d.city}: nema leta u kešu (${origin}->${d.iata} ${month})`);
          return null;
        }
        const hotel = await cheapestHotel(
          d.hotelCity, d.country, flight.departureAt, flight.returnAt
        );
        if (!hotel) {
          console.log(`[deals] ${d.city}: nema hotela (${flight.departureAt} -> ${flight.returnAt})`);
          return null;
        }
        const flightTotal = flight.pricePerPerson * 2;
        const total = flightTotal + hotel.best.total;
        const avgPackage = flightTotal + hotel.avgTotal;
        return {
          city: d.city,
          code: d.iata,
          gradient: d.gradient,
          flightTotal,
          airline: flight.airline,
          transfers: flight.transfers,
          departureAt: flight.departureAt,
          returnAt: flight.returnAt,
          flightLink: flight.link,
          hotelTotal: hotel.best.total,
          hotelName: hotel.best.name,
          hotelStars: hotel.best.stars,
          hotelRating: hotel.best.rating,
          total,
          avgMarket: avgPackage,
          savingsPct: Math.max(0, Math.round((1 - total / avgPackage) * 100)),
        };
      } catch (e) {
        console.log(`[deals] ${d.city}: greška — ${e.message}`);
        return null;
      }
  });
  return results
    .filter(Boolean)
    .filter((r) => r.total <= budget)
    .sort((a, b) => a.total - b.total);
}

// --- HTTP server: /api/deals + statički fajlovi ---
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };
createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/deals") {
    const params = {
      origin: (url.searchParams.get("origin") || "BEG").toUpperCase(),
      month: url.searchParams.get("month") || "2026-09",
      nights: Number(url.searchParams.get("nights") || 3),
      budget: Number(url.searchParams.get("budget") || 400),
    };
    try {
      const deals = await getDeals(params);
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ deals, params, live: true }));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e) }));
    }
    return;
  }
  // statika
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  try {
    const content = await readFile(join(process.cwd(), file));
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(3000, () => console.log("Trip backend: http://localhost:3000"));
