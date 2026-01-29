/* ===============================
   MONETAG – FULL AD HANDLER
   =============================== */

// safety check
if (typeof show_10511608 !== "function") {
  console.error("Monetag SDK not loaded");
}

/* ---------- 1️⃣ BANNER AD (AUTO) ---------- */
window.addEventListener("load", () => {
  try {
    show_10511608({
      type: "banner",
      container: "monetag-banner"
    });
  } catch (e) {
    console.log("Banner error", e);
  }
});


/* ---------- 2️⃣ INSTALL & EARN (BUTTON) ---------- */
function installOffer() {
  show_10511608('pop')
    .then(() => {
      alert("Install + Open + Sign-up complete karo. Reward verification Monetag karega.");
      // ❌ yahan reward mat do
      // ✅ reward sirf postback se aayega
    })
    .catch(() => {
      alert("Offer abhi available nahi hai");
    });
}


/* ---------- 3️⃣ REWARDED INTERSTITIAL (AUTO) ---------- */
function autoRewardedAd() {
  show_10511608()
    .then(() => {
      console.log("Rewarded ad shown (no instant reward)");
    })
    .catch(() => {});
}

// har 10 minute me max 1 rewarded
setInterval(autoRewardedAd, 10 * 60 * 1000);


/* ---------- 4️⃣ IN-APP INTERSTITIAL (AUTO BACKGROUND) ---------- */
show_10511608({
  type: "inApp",
  inAppSettings: {
    frequency: 2,
    capping: 0.2,     // 12 min
    interval: 30,
    timeout: 5,
    everyPage: false
  }
});
