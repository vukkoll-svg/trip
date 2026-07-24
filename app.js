const $ = (id) => document.getElementById(id);

function computeDeals(origin, month, nights, budget) {
  const of = ORIGIN_FACTOR[origin];
  const mf = MONTH_FACTOR[month];

  return DESTINATIONS.map((d) => {
    const flightPerPerson = Math.round(d.flight * of * mf);
    const flightTotal = flightPerPerson * 2;
    const hotelTotal = Math.round(d.hotelNight * mf * nights);
    const total = flightTotal + hotelTotal;
    const avgMarket = Math.round(total * d.avgMarketFactor);
    const savingsPct = Math.round((1 - total / avgMarket) * 100);
    return { ...d, flightTotal, hotelTotal, total, avgMarket, savingsPct };
  })
    .filter((deal) => deal.total <= budget)
    .sort((a, b) => a.total - b.total);
}

function dealCard(deal, nights) {
  return `
    <article class="deal-card">
      <div class="deal-banner" style="background: linear-gradient(135deg, ${deal.gradient[0]}, ${deal.gradient[1]})">
        <span class="savings-badge">−${deal.savingsPct}% od proseka</span>
        ${deal.city} · ${deal.code}
      </div>
      <div class="deal-body">
        <div class="deal-line"><span>✈️ Povratni let (2 osobe)</span><span>${deal.flightTotal} €</span></div>
        <div class="deal-line"><span>🏨 Hotel, ${nights} noći (2 osobe)</span><span>${deal.hotelTotal} €</span></div>
        <div class="market-compare">Prosečna cena ovog paketa: <s>${deal.avgMarket} €</s> — ušteda ${deal.avgMarket - deal.total} €</div>
        <div class="deal-total">
          <span class="label">Ukupno za dvoje</span>
          <span class="price">${deal.total} €</span>
        </div>
        <a class="cta" href="#" onclick="return false">Vidi ponudu</a>
      </div>
    </article>`;
}

function render() {
  const origin = $("origin").value;
  const month = Number($("month").value);
  const nights = Number($("nights").value);
  const budget = Number($("budget").value);

  $("budget-label").textContent = `${budget} €`;

  const deals = computeDeals(origin, month, nights, budget);
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
