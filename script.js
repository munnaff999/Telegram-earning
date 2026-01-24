const tg = window.Telegram.WebApp;
tg.expand();

let coins = parseInt(localStorage.getItem("coins")) || 0;
updateCoins();

// USER
if (tg.initDataUnsafe.user) {
  document.getElementById("username").innerText =
    tg.initDataUnsafe.user.first_name;
}

// NAVIGATION
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goEarn() {
  showPage("earn");
}

// WATCH ADS (REAL MONETAG)
function watchAd() {
  if (typeof show_10511608 !== "function") {
    alert("Ad not loaded yet, try again");
    return;
  }

  show_10511608().then(() => {
    coins += 1; // REAL reward
    save();
    alert("✅ You earned ₹1");
  }).catch(() => {
    alert("❌ Ad not completed");
  });
}

// INSTALL CPA (REAL LINK)
function openInstall() {
  window.open("https://trianglerockers.com/1869976", "_blank");
}

// WITHDRAW
function withdraw() {
  const amt = parseInt(document.getElementById("amount").value);

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
  updateCoins();
}

function updateCoins() {
  document.getElementById("coins").innerText = coins;
}
