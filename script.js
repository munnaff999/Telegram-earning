const tg = window.Telegram.WebApp;
tg.expand();

let coins = parseInt(localStorage.getItem("coins")) || 0;
updateCoin();

// USER
if (tg.initDataUnsafe.user) {
  document.getElementById("user").innerText =
    tg.initDataUnsafe.user.first_name;
}

// NAV
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goEarn() {
  show("earn");
}

// WATCH AD (REAL)
function watchAd() {
  if (typeof show_10511608 !== "function") {
    alert("Ad not ready");
    return;
  }

  show_10511608().then(() => {
    coins += 1; // REAL reward
    save();
    alert("✅ You earned ₹1");
  }).catch(() => {
    alert("Ad failed, try later");
  });
}

// INSTALL CPA
function openInstall() {
  window.open("https://trianglerockers.com/1869976", "_blank");
}

// WALLET
function withdraw() {
  let amt = parseInt(document.getElementById("amt").value);

  if (amt < 499) {
    alert("Minimum withdrawal ₹499");
    return;
  }
  if (coins < amt) {
    alert("Not enough balance");
    return;
  }

  coins -= amt;
  save();
  alert("Withdrawal request submitted");
}

// SAVE
function save() {
  localStorage.setItem("coins", coins);
  updateCoin();
}

function updateCoin() {
  document.getElementById("coin").innerText = coins;
}
