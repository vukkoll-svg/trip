# Trip — najjeftinija putovanja iz tvog grada

Aplikacija koja za zadati budžet i mesec pokazuje najjeftinije kombinacije
**let + hotel** iz regionalnih aerodroma (BEG, INI, TSR, SOF), sa poređenjem
u odnosu na prosečnu tržišnu cenu.

## Trenutno stanje: faza 1 — prave cene ✅

- `server.js` — Node backend (bez zavisnosti): kombinuje Aviasales letove
  i liteAPI hotele, keš 6h, retry + ograničen paralelizam
- `destinations.js` — lista destinacija (IATA + grad za hotele)
- `index.html`, `styles.css`, `app.js` — frontend; ako backend nije dostupan
  (npr. na GitHub Pages), automatski pada na mock podatke iz `data.js`

Pokretanje: napravi `.env` (vidi ispod), pa `node server.js` → http://localhost:3000

```
TRAVELPAYOUTS_TOKEN=...
TRAVELPAYOUTS_MARKER=...
LITEAPI_KEY=...
```

## Plan razvoja

### Faza 1 — pravi podaci (1–2 nedelje)
- [x] Registracija Travelpayouts + projekat povezan sa Aviasales (24.7.2026)
- [x] Registracija Nuitée Connect / liteAPI (sandbox key, 24.7.2026)
- [x] Node backend sa adapterima za izvore podataka (`server.js`)
- [x] Aviasales Data API → najjeftiniji letovi (povratni + fallback na 2 jednosmerna)
- [x] liteAPI hotel search → najjeftiniji hotel za datume leta (svih 12 destinacija radi)
- [x] Keširanje u memoriji (6h TTL) + retry + max 4 paralelna poziva
- [ ] Booking.com/Agoda affiliate linkovi kad Travelpayouts odobri projekat
- [ ] liteAPI production key (sandbox → prod) pre javnog puštanja

### Faza 2 — poređenje cena i popusti
- [ ] Dnevno snimanje cena u bazu → istorijski prosek po ruti/mesecu
- [ ] "X% ispod proseka" badge na osnovu sopstvenih podataka
- [ ] Detekcija pada cene ("popust") u odnosu na prethodnih 30 dana

### Faza 3 — zarada i korisnici
- [ ] Affiliate linkovi (Travelpayouts partner marker) na "Vidi ponudu"
- [ ] Email/Telegram alarmi "cena pala za tvoju rutu"
- [ ] Deploy (Vercel/Railway) + domen

## Poslovni model

Affiliate provizije (Aviasales/Hotellook preko Travelpayouts mreže) — ne
prodajemo karte sami, samo preusmeravamo, pa nema licenci ni obrade plaćanja.
