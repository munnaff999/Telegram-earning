// script.js
import { auth, db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const cpaLinks = [
  "https://otieu.com/4/10508140",
  "https://otieu.com/4/10508130",
  "https://otieu.com/4/10507919",
  "https://otieu.com/4/10508135",
  "https://otieu.com/4/10508127",
  "https://trianglerockers.com/1869976",
  "https://trianglerockers.com/1870187"
];

function openSmartlink() {
  const index = Math.floor(Math.random() * cpaLinks.length);
  window.open(cpaLinks[index], "_blank");
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

// Rewarded Interstitial
setTimeout(() => {
  show_10511608().catch(()=>{});
}, 60000);

// Rewarded Popup
setTimeout(() => {
  show_10511608('pop').catch(()=>{});
}, 180000);

/* USER DATA */
if (tg.initDataUnsafe.user) {
  document.getElementById("name").innerText =
    tg.initDataUnsafe.user.first_name;
  document.getElementById("uid").innerText =
    tg.initDataUnsafe.user.id;
}

updateUI();
async function openOffer(packageName, link) {
  const user = auth.currentUser;
  if (!user) return alert("Login error");

  const q = query(
    collection(db, "installed_apps"),
    where("uid", "==", user.uid),
    where("package", "==", packageName)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    alert("❌ Already installed. No coins.");
    return;
  }

  window.open(link, "_blank");
}

import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe.user?.id || "guest";

/* 🔹 MAIN INSTALL FUNCTION */
async function openOffer(offerId, link) {

  const docId = `${userId}_${offerId}`;
  const ref = doc(db, "completedOffers", docId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    alert("❌ Is app ka reward pehle mil chuka hai");
    return;
  }

  // ✅ First time install
  await setDoc(ref, {
    userId: userId,
    offerId: offerId,
    completed: true,
    time: serverTimestamp()
  });

  window.open(link, "_blank");

  alert("✅ Install complete hone par reward eligible");
}
