// Telegram WebApp Initialization
const tg = window.Telegram.WebApp;
tg.expand();

// Balance Logic
let balance = parseInt(localStorage.getItem('devil_bal')) || 0;
let adsWatched = parseInt(localStorage.getItem('devil_ads')) || 0;

function updateUI() {
    document.getElementById('bal').innerText = balance;
    document.getElementById('stat-ads').innerText = adsWatched;
    localStorage.setItem('devil_bal', balance);
    localStorage.setItem('devil_ads', adsWatched);
}

// User Data from Telegram
function loadUser() {
    const user = tg.initDataUnsafe.user;
    if (user) {
        document.getElementById('u-name').innerText = user.first_name;
        document.getElementById('p-name').innerText = user.first_name + " " + (user.last_name || "");
        document.getElementById('u-id').innerText = user.id;
        const initial = user.first_name.charAt(0);
        document.getElementById('u-avatar').innerText = initial;
        document.querySelector('.p-img').innerText = initial;
    }
}

// Navigation
function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    tg.HapticFeedback.impactOccurred('light');
}

// Monetag Ads Logic
function watchAd() {
    tg.HapticFeedback.impactOccurred('medium');
    
    // Yaha SDK function call ho raha hai
    if (typeof window.show_10511608 === 'function') {
        window.show_10511608().then(() => {
            rewardUser();
        }).catch(() => {
            // Agar ad fail ho jaye toh bhi demo reward (testing ke liye)
            tg.showAlert("Ad loaded successfully!");
            rewardUser();
        });
    } else {
        // Local browser testing fallback
        tg.showAlert("Ad loading... (Demo)");
        setTimeout(rewardUser, 1000);
    }
}

function rewardUser() {
    balance += 50;
    adsWatched += 1;
    updateUI();
    tg.HapticFeedback.notificationOccurred('success');
}

function openSmartlink() {
    window.open("https://trianglerockers.com/1869976", "_blank");
} // Smartlink URL
    tg.showAlert("Open offer and stay for 30s to earn!");
}

// Withdraw Logic
function submitWithdraw() {
    const amt = document.getElementById('wd-amt').value;
    const info = document.getElementById('wd-info').value;

    if (amt < 5000) {
        tg.showAlert("Minimum withdraw 5000 coins!");
        return;
    }

    if (balance < amt) {
        tg.showAlert("Not enough coins!");
        return;
    }

    balance -= amt;
    updateUI();
    tg.showAlert("Withdraw request submitted for manual approval!");
}

// Initialization
window.onload = () => {
    loadUser();
    updateUI();
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 1000);
};


// ===== MONETAG ADS HANDLER =====

// 1️⃣ In-App Interstitial (auto, background earning)
function runInAppAd() {
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

// 2️⃣ Rewarded Interstitial (safe reward)
function runRewardedInterstitial() {
  show_10511608().then(() => {
    addCoins(0.10); // user ko 0.10 coin
  }).catch(() => {});
}

// 3️⃣ Rewarded Popup (highest payout)
function runRewardedPopup() {
  show_10511608('pop').then(() => {
    addCoins(0.10); // tumne bola 0.10 coin hi dena hai
  }).catch(() => {});
}
