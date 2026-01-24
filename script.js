const tg = window.Telegram.WebApp;
tg.expand();

let coins = parseFloat(localStorage.getItem("coins")) || 0;

function updateUI() {
  document.getElementById("coins").innerText = coins.toFixed(2);
  document.getElementById("walletCoins").innerText = coins.toFixed(2);
  localStorage.setItem("coins", coins);
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function openSmartlink() {
  window.open("https://trianglerockers.com/1869976/", "_blank");
}

function withdraw() {
  const amt = Number(document.getElementById("amount").value);
  if (amt < 499) {
    alert("Minimum withdraw ₹499");
    return;
  }
  if (coins < amt) {
    alert("Insufficient balance");
    return;
  }
  coins -= amt;
  updateUI();
  alert("Withdraw request submitted");
}

/* =========================
   MONETAG AUTO ADS (SAFE)
========================= */

// 1️⃣ In-App Interstitial (NO reward)
show_10511608({
  type: 'inApp',
  inAppSettings: {
    frequency: 2,
    capping: 0.1,
    interval: 30,
    timeout: 5,
    everyPage: false
  }
});

// 2️⃣ Rewarded Interstitial (after 60 sec)
setTimeout(() => {
  show_10511608().then(() => {
    coins += 0.10;
    updateUI();
  }).catch(()=>{});
}, 60000);

// 3️⃣ Rewarded Popup (after 3 min)
setTimeout(() => {
  show_10511608('pop').then(() => {
    coins += 0.10;
    updateUI();
  }).catch(()=>{});
}, 180000);

/* USER DATA */
if (tg.initDataUnsafe.user) {
  document.getElementById("name").innerText =
    tg.initDataUnsafe.user.first_name;
  document.getElementById("uid").innerText =
    tg.initDataUnsafe.user.id;
}

updateUI();
