# Istraživanje API-ja i tržišta (jul 2026)

## Letovi

| Izvor | Status | Cena | Napomena |
|---|---|---|---|
| **Amadeus Self-Service** | ✅ Otvoren za sve | ~2.000 besplatnih poziva mesečno za Flight Offers Search; posle toga par centi po pozivu | Test okruženje potpuno besplatno. Pokriva i hotele. Najbolji za start. |
| **Travelpayouts / Aviasales Data API** | ✅ Otvoren uz registraciju u affiliate mrežu | Besplatan (keširane cene) | Nova verzija Flights API od nov. 2025 (stara gasi 15.6.2026). Limit ~200 upita/sat po IP korisnika. Idealno za "najjeftinije destinacije" pretragu + affiliate zarada. |
| **Kiwi Tequila** | ❌ Zatvoren za nove developere | — | Samo na poziv; preko Travelpayouts traži 50.000 MAU. Otpada. |
| **Duffel** | ⚠️ Za prodaju karata | $3 po rezervaciji, search besplatan do 1500:1 search-to-book | Ima smisla tek kad budemo prodavali karte direktno. |
| **SerpAPI (Google Flights)** | ⚠️ Skrejpovanje | 250 besplatno, zatim od $25/1000 pretraga | Rezerva za validaciju cena, skupo za glavni izvor. |

## Hoteli

| Izvor | Status | Napomena |
|---|---|---|
| **Hotellook API** | ❌ UGAŠEN (okt 2025) | Brend zatvoren, API vraća 404 — potvrđeno testom 24.7.2026. |
| **Amadeus Self-Service** | ❌ UGAŠEN (17.7.2026) | Ceo self-service program zatvoren, ostao samo Enterprise (ugovori). Otpada i za letove i za hotele. |
| **Nuitée Connect / liteAPI** | ✅ Besplatan sandbox, bez kartice | 3M+ hotela, live cene i rezervacije; revenue-share model. **Glavni izvor hotelskih cena.** Reg: connect.nuitee.com |
| **Booking.com affiliate (kroz Travelpayouts)** | ⏳ Čeka odobrenje projekta | U TP katalogu, 3–5% provizije. Linkovi za zaradu, ne daje cene kroz API. Agoda (6%) i Expedia (1,35–3,6%) takođe u katalogu. |
| **Booking.com Demand API** | ❌ Nedostupan malim partnerima | Skrejpovanje krši ToS — otpada. |

## Ključni zaključci

1. **Stack za MVP: Travelpayouts (Aviasales + Hotellook) + Amadeus** — sve besplatno na startu, affiliate model odmah donosi zaradu.
2. **Ne poredimo se sa "cenom na Bookingu"** (pravno i tehnički klizavo) nego sa **prosečnom/istorijskom cenom** koju sami računamo iz keširanih podataka.
3. **Diferencijacija:** paketna cena let+hotel iz regionalnih aerodroma (BEG/INI/TSR/SOF) + fleksibilna pretraga po budžetu — to veliki igrači ne rade dobro.

## Status naloga (ažurirano 24.7.2026)

1. ✅ **Travelpayouts** — registrovan; projekat "Trip" (https://vukkoll-svg.github.io/trip/) povezan sa Aviasales programom. Token i marker u lokalnom `.env`. Flight Data API testiran i radi (BEG→BCN sept: 84 € povratna). Projekat na pregledu — kad prođe, povezati Booking.com i Agoda programe za hotele.
2. ❌ **Amadeus for Developers** — self-service ugašen 17.7.2026, ne registrovati.
3. ⬜ **Nuitée Connect (liteAPI)** — https://connect.nuitee.com/register (besplatan sandbox bez kartice) — SLEDEĆI KORAK, za hotelske cene.

## Izvori

- https://developers.amadeus.com/pricing
- https://developers.amadeus.com/blog/new-self-service-pricing-amadeus-api
- https://support.travelpayouts.com/hc/en-us/articles/206635217-How-to-get-access-to-the-API
- https://support.travelpayouts.com/hc/en-us/articles/203956133-Hotel-search-API
- https://support.travelpayouts.com/hc/en-us/articles/360019237899-Kiwi-com-affiliate-program-API
- https://developers.booking.com/demand/docs/getting-started/try-out-the-api
- https://affiliates.support.booking.com/kb/s/article/API-access
- https://duffel.com/why-duffel/tequila-by-kiwi-vs-duffel
- https://thunderbit.com/blog/best-flight-api-with-free-tiers
- https://www.scrapingbee.com/blog/top-flights-apis-for-travel-apps/
