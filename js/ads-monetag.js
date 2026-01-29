/* ================================
   INSTALL & EARN (MAIN EARNING)
   ================================ */

function showInstallOffer() {
  if (typeof show_10511608 === "undefined") {
    alert("Ads loading... thoda wait karo");
    return;
  }

  show_10511608('pop')
    .then(() => {
      alert(
        "Offer opened!\n\n" +
        "Steps:\n" +
        "1️⃣ App install karo\n" +
        "2️⃣ Open karo\n" +
        "3️⃣ Sign-up complete karo\n\n" +
        "Reward Monetag verify ke baad milega"
      );
    })
    .catch(() => {
      alert("Ad open nahi hua, dubara try karo");
    });
}

/* ================================
   EXTRA ADS (OPTIONAL – AUTO)
   ================================ */

function showInAppAd() {
  if (typeof show_10511608 === "undefined") return;

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
}
