function watchAd(){
  // Monetag rewarded callback aane par
  completeOffer(25)
}

function installAd(){
  completeOffer(25)
}
// INSTALL & EARN (Rewarded Popup)
function showInstallOffer() {
  show_10511608('pop')
    .then(() => {
      alert('Offer opened! Install & complete to earn.');
      // yahan future me reward logic aayega
    })
    .catch(() => {
      console.log('Monetag popup failed');
    });
}

// UNLOCK REWARD (Rewarded Interstitial)
function showRewardedAd() {
  show_10511608()
    .then(() => {
      alert('Ad watched! Reward unlocked.');
      // yahan coins / unlock ka code aayega
    });
}

// IN-APP INTERSTITIAL (LIMITED AUTO)
function showInAppAd() {
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
