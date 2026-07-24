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
| **Hotellook API (Travelpayouts)** | ✅ Besplatan uz registraciju | Keširane cene, 60 upita/min. Affiliate linkovi = zarada po rezervaciji. |
| **Amadeus Hotel Search** | ✅ Besplatan tier | Isti nalog kao za letove. |
| **Booking.com API** | ❌ Praktično nedostupan | Demand API samo za odobrene partnere; prijave za connectivity pauzirane. Affiliate program otvoren, ali bez pravog API-ja za male partnere. Skrejpovanje krši ToS — otpada. |

## Ključni zaključci

1. **Stack za MVP: Travelpayouts (Aviasales + Hotellook) + Amadeus** — sve besplatno na startu, affiliate model odmah donosi zaradu.
2. **Ne poredimo se sa "cenom na Bookingu"** (pravno i tehnički klizavo) nego sa **prosečnom/istorijskom cenom** koju sami računamo iz keširanih podataka.
3. **Diferencijacija:** paketna cena let+hotel iz regionalnih aerodroma (BEG/INI/TSR/SOF) + fleksibilna pretraga po budžetu — to veliki igrači ne rade dobro.

## Šta korisnik (vlasnik projekta) treba da registruje

1. **Travelpayouts nalog** — https://www.travelpayouts.com (besplatno; token na developers stranici)
2. **Amadeus for Developers nalog** — https://developers.amadeus.com (besplatno; API key + secret za test okruženje)

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
