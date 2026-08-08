
/* CASTOTO MIX PARLAY - SETTLEMENT ENGINE
   MENANG FULL     = odds
   MENANG SETENGAH = (odds + 1) / 2
   KALAH SETENGAH  = 0.5
   KALAH FULL      = 0
   SERI            = 1
*/
function settlementMultiplier(odds, result) {
  const o = Number(odds) || 0;
  switch (result) {
    case "fullwin":  return o;
    case "halfwin":  return (o + 1) / 2;
    case "halfloss": return 0.5;
    case "draw":     return 1;
    case "loss":     return 0;
    default:         return o;
  }
}

function calculateSettlement() {
  const stakeEl = document.getElementById("stake");
  const rows = document.querySelectorAll(".match");
  if (!stakeEl || !rows.length) return;

  const stake = Math.max(0, Number(stakeEl.value) || 0);
  let rawOdds = 1;
  let effectiveOdds = 1;

  rows.forEach(row => {
    const oddsEl = row.querySelector(".match-odds");
    const resultEl = row.querySelector(".result-select");
    const odds = Math.max(0.01, Number(oddsEl?.value) || 1);
    const result = resultEl?.value || "fullwin";

    rawOdds *= odds;
    effectiveOdds *= settlementMultiplier(odds, result);
  });

  const payout = stake * effectiveOdds;
  const profit = payout - stake;

  const money = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  });

  const totalOdds = document.getElementById("totalOdds");
  const payoutEl = document.getElementById("payout");
  const profitEl = document.getElementById("profit");

  if (totalOdds) {
    totalOdds.textContent = rawOdds.toLocaleString("id-ID", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  }
  if (payoutEl) payoutEl.textContent = money.format(payout);
  if (profitEl) profitEl.textContent = money.format(profit);
}

window.addEventListener('DOMContentLoaded', calculateSettlement);
