const matchesEl = document.getElementById("matches");
const template = document.getElementById("matchTemplate");
const stake = document.getElementById("stake");

const totalOddsEl = document.getElementById("totalOdds");
const payoutEl = document.getElementById("payout");
const profitEl = document.getElementById("profit");

const money = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

function addMatch(name = "", odds = 1.50) {
  const fragment = template.content.cloneNode(true);
  const row = fragment.querySelector(".match");
  const nameInput = row.querySelector(".match-name");
  const oddsInput = row.querySelector(".match-odds");

  nameInput.value = name;
  oddsInput.value = Number(odds).toFixed(2);

  nameInput.addEventListener("input", calculate);
  oddsInput.addEventListener("input", calculate);

  row.querySelector(".odds-minus").addEventListener("click", () => {
    oddsInput.value = Math.max(0.01, (Number(oddsInput.value) || 0) - 0.01).toFixed(2);
    calculate();
  });

  row.querySelector(".odds-plus").addEventListener("click", () => {
    oddsInput.value = ((Number(oddsInput.value) || 0) + 0.01).toFixed(2);
    calculate();
  });

  row.querySelector(".delete").addEventListener("click", () => {
    if (matchesEl.querySelectorAll(".match").length <= 1) {
      nameInput.value = "";
      oddsInput.value = "1.50";
    } else {
      row.remove();
    }
    renumber();
    calculate();
  });

  matchesEl.appendChild(fragment);
  renumber();
  calculate();
}

function renumber() {
  matchesEl.querySelectorAll(".match").forEach((row, index) => {
    row.querySelector(".match-number").textContent =
      String(index + 1).padStart(2, "0");
  });
}

function calculate() {
  const stakeValue = Math.max(0, Number(stake.value) || 0);
  const oddsInputs = matchesEl.querySelectorAll(".match-odds");

  let total = 1;
  oddsInputs.forEach(input => {
    const value = Number(input.value);
    total *= Number.isFinite(value) && value > 0 ? value : 1;
  });

  const payout = stakeValue * total;
  const profit = payout - stakeValue;

  totalOddsEl.textContent = total.toLocaleString("id-ID", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
  payoutEl.textContent = money.format(payout);
  profitEl.textContent = money.format(profit);
}

document.getElementById("addMatch").addEventListener("click", () => {
  addMatch("", 1.50);
});

document.getElementById("reset").addEventListener("click", () => {
  stake.value = 100000;
  matchesEl.innerHTML = "";
  addMatch("Manchester City vs Arsenal", 1.85);
  addMatch("Real Madrid vs Barcelona", 1.70);
  addMatch("Bayern Munich vs Dortmund", 1.45);
});

document.getElementById("minusStake").addEventListener("click", () => {
  stake.value = Math.max(0, (Number(stake.value) || 0) - 10000);
  calculate();
});

document.getElementById("plusStake").addEventListener("click", () => {
  stake.value = (Number(stake.value) || 0) + 10000;
  calculate();
});

stake.addEventListener("input", calculate);

addMatch("Manchester City vs Arsenal", 1.85);
addMatch("Real Madrid vs Barcelona", 1.70);
addMatch("Bayern Munich vs Dortmund", 1.45);
