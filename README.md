# Trip — najjeftinija putovanja iz tvog grada

Aplikacija koja za zadati budžet i mesec pokazuje najjeftinije kombinacije
**let + hotel** iz regionalnih aerodroma (BEG, INI, TSR, SOF), sa poređenjem
u odnosu na prosečnu tržišnu cenu.

## Trenutno stanje: prototip (faza 0)

Statička web aplikacija sa probnim (mock) podacima — demonstrira UX i logiku:

- `index.html`, `styles.css`, `app.js` — interfejs i logika
- `data.js` — mock podaci (destinacije, cene, sezonski koeficijenti)

Pokretanje: `npx http-server -p 4173 .` pa otvori http://localhost:4173

## Plan razvoja

### Faza 1 — pravi podaci (1–2 nedelje)
- [x] Registracija Travelpayouts + projekat povezan sa Aviasales (24.7.2026)
- [ ] Registracija Amadeus for Developers (za hotelske cene — Hotellook je ugašen)
- [ ] Node.js backend (Express) sa adapterima za izvore podataka
- [ ] Aviasales Data API → najjeftiniji letovi po destinaciji/mesecu (token testiran ✅)
- [ ] Amadeus Hotel Search → najjeftiniji hoteli za iste datume
- [ ] Booking.com/Agoda affiliate linkovi kad Travelpayouts odobri projekat
- [ ] Keširanje odgovora (SQLite) da ne trošimo API limite

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
