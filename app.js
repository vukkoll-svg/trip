const $ = (id) => document.getElementById(id);

// --- mock režim (GitHub Pages, bez backenda) ---
function computeMockDeals(origin, month, nights, budget) {
  const of = ORIGIN_FACTOR[origin];
  const mf = MONTH_FACTOR[month];
  return DESTINATIONS.map((d) => {
    const flightTotal = Math.round(d.flight * of * mf) * 2;
    const hotelTotal = Math.round(d.hotelNight * mf * nights);
    const total = flightTotal + hotelTotal;
    const avgMarket = Math.round(total * d.avgMarketFactor);
    return {
      city: d.city, code: d.code, gradient: d.gradient,
      flightTotal, hotelTotal, total, avgMarket,
      savingsPct: Math.round((1 - total / avgMarket) * 100),
    };
  })
    .filter((deal) => deal.total <= budget)
    .sort((a, b) => a.total - b.total);
}

function dealCard(deal, nights) {
  const flightMeta = deal.airline
    ? ` <small>(${deal.airline}${deal.transfers ? ", presedanje" : ", direktan"})</small>`
    : "";
  const hotelLabel = deal.hotelName
    ? `🏨 ${deal.hotelName}${deal.hotelStars ? " " + "★".repeat(deal.hotelStars) : ""}`
    : `🏨 Hotel, ${nights} noći (2 osobe)`;
  const dates = deal.departureAt
    ? `<div class="deal-line"><span>📅 Termin</span><span>${deal.departureAt} → ${deal.returnAt}</span></div>`
    : "";
  const cta = deal.flightLink
    ? `<a class="cta" href="${deal.flightLink}" target="_blank" rel="noopener">Vidi ponudu ✈️</a>`
    : `<a class="cta" href="#" onclick="return false">Vidi ponudu</a>`;
  return `
    <article class="deal-card">
      <div class="deal-banner" style="background: linear-gradient(135deg, ${deal.gradient[0]}, ${deal.gradient[1]})">
        ${deal.savingsPct > 0 ? `<span class="savings-badge">−${deal.savingsPct}% od proseka</span>` : ""}
        ${deal.city} · ${deal.code}
      </div>
      <div class="deal-body">
        ${dates}
        <div class="deal-line"><span>✈️ Povratni let (2 osobe)${flightMeta}</span><span>${deal.flightTotal} €</span></div>
        <div class="deal-line"><span>${hotelLabel}</span><span>${deal.hotelTotal} €</span></div>
        <div class="market-compare">Prosečan paket za ovaj grad: <s>${deal.avgMarket} €</s> — ušteda ${deal.avgMarket - deal.total} €</div>
        <div class="deal-total">
          <span class="label">Ukupno za dvoje</span>
          <span class="price">${deal.total} €</span>
        </div>
        ${cta}
      </div>
    </article>`;
}

let liveMode = null; // null = još ne znamo, true = backend radi, false = mock

async function fetchLiveDeals(origin, month, nights, budget) {
  const monthParam = `2026-${String(month).padStart(2, "0")}`;
  const res = await fetch(
    `/api/deals?origin=${origin}&month=${monthParam}&nights=${nights}&budget=${budget}`,
    { signal: AbortSignal.timeout(60000) }
  );
  if (!res.ok) throw new Error("backend error");
  return (await res.json()).deals;
}

let renderSeq = 0;
async function render() {
  const origin = $("origin").value;
  const month = Number($("month").value);
  const nights = Number($("nights").value);
  const budget = Number($("budget").value);
  const seq = ++renderSeq;

  $("budget-label").textContent = `${budget} €`;

  let deals;
  if (liveMode !== false) {
    $("results-count").textContent = "Učitavam prave cene…";
    try {
      deals = await fetchLiveDeals(origin, month, nights, budget);
      liveMode = true;
      $("live-badge")?.remove();
      document.querySelector(".disclaimer")?.classList.add("live");
      document.querySelector(".disclaimer") &&
        (document.querySelector(".disclaimer").textContent = "Prave cene: Aviasales + liteAPI");
    } catch {
      liveMode = false;
    }
  }
  if (liveMode === false) deals = computeMockDeals(origin, month, nights, budget);
  if (seq !== renderSeq) return; // stigao je noviji zahtev

  $("results-count").textContent = deals.length
    ? `${deals.length} destinacija u okviru budžeta`
    : "Nema destinacija u okviru budžeta";

  $("results").innerHTML = deals.length
    ? deals.map((d) => dealCard(d, nights)).join("")
    : `<div class="empty-state"><div class="emoji">🧳</div>Povećaj budžet ili probaj jeftiniji mesec — novembar je obično najpovoljniji.</div>`;
}

["origin", "month", "nights", "budget"].forEach((id) =>
  $(id).addEventListener("input", render)
);

render();
