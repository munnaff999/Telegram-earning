/*************************************************
 XDEVIL EARNING - CORE APP LOGIC
 Author: Production Safe
 Mode: Vanilla JS (No Module)
**************************************************/

/* ===============================
   FIREBASE CONFIG (REPLACE)
================================ */
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "XXXXXX"
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();

/* ===============================
   GLOBAL STATE
================================ */
let currentUser = null;
let walletUnsub = null;

/* ===============================
   AUTH - ANONYMOUS LOGIN
================================ */
auth.onAuthStateChanged(async user => {
  if (!user) {
    await auth.signInAnonymously();
    return;
  }

  currentUser = user;
  document.getElementById("uidText").innerText = user.uid;

  await ensureUserDoc(user.uid);
  listenWallet(user.uid);
  loadTransactions(user.uid);
});

/* ===============================
   USER INIT
================================ */
async function ensureUserDoc(uid) {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      walletLocked: false,
      banned: false,
      email: "",
      phone: ""
    });

    await db.collection("wallets").doc(uid).set({
      balance: 0
    });
  }
}

/* ===============================
   WALLET REALTIME
================================ */
function listenWallet(uid) {
  if (walletUnsub) walletUnsub();

  walletUnsub = db
    .collection("wallets")
    .doc(uid)
    .onSnapshot(doc => {
      if (!doc.exists) return;
      document.getElementById("balanceText").innerText =
        "₹" + doc.data().balance;
    });
}

/* ===============================
   TRANSACTION HISTORY
================================ */
async function loadTransactions(uid) {
  const list = document.getElementById("txList");
  list.innerHTML = "";

  const q = await db
    .collection("wallet_transactions")
    .where("uid", "==", uid)
    .orderBy("time", "desc")
    .limit(20)
    .get();

  q.forEach(doc => {
    const d = doc.data();
    const div = document.createElement("div");
    div.className = "tx " + d.type;
    div.innerHTML = `
      <div>
        <b>${d.source}</b><br>
        <small>${new Date(d.time.toDate()).toLocaleString()}</small>
      </div>
      <div>${d.type === "credit" ? "+" : "-"}₹${d.amount}</div>
    `;
    list.appendChild(div);
  });
}

/* ===============================
   PAGE NAVIGATION
================================ */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===============================
   OFFER INSTALL HANDLER
================================ */
async function openOffer(offerId, url) {
  if (!currentUser) return;

  const uid = currentUser.uid;
  const docId = uid + "_" + offerId;
  const ref = db.collection("completedOffers").doc(docId);

  const snap = await ref.get();
  if (snap.exists) {
    alert("❌ Is app ka reward pehle mil chuka hai");
    return;
  }

  // Open CPA link
  window.open(url, "_blank");

  // TEMP CREDIT (SAFE INTERIM)
  await creditWallet(uid, 5, "App Install");

  await ref.set({
    uid,
    offerId,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });

  loadTransactions(uid);
}

/* ===============================
   WALLET CREDIT (ATOMIC)
================================ */
async function creditWallet(uid, amount, source) {
  const walletRef = db.collection("wallets").doc(uid);
  const txRef = db.collection("wallet_transactions").doc();

  await db.runTransaction(async t => {
    const w = await t.get(walletRef);
    const bal = w.data().balance;

    t.update(walletRef, { balance: bal + amount });
    t.set(txRef, {
      uid,
      type: "credit",
      source,
      amount,
      status: "success",
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
}

/* ===============================
   WITHDRAWAL REQUEST
================================ */
async function requestWithdraw() {
  const uid = currentUser.uid;

  const upi = document.getElementById("upi").value.trim();
  const bank = document.getElementById("bank").value.trim();
  const acc = document.getElementById("account").value.trim();
  const ifsc = document.getElementById("ifsc").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (!upi || !bank || !acc || !ifsc || !email || !mobile) {
    alert("❌ Pura form bharo");
    return;
  }

  const walletSnap = await db.collection("wallets").doc(uid).get();
  const bal = walletSnap.data().balance;

  if (bal < 499) {
    alert("❌ Minimum withdrawal ₹499");
    return;
  }

  const existing = await db
    .collection("withdrawals")
    .where("uid", "==", uid)
    .where("status", "==", "pending")
    .get();

  if (!existing.empty) {
    alert("❌ Pehle se ek withdrawal pending hai");
    return;
  }

  await db.collection("withdrawals").add({
    uid,
    amount: bal,
    upi,
    bank,
    acc,
    ifsc,
    email,
    mobile,
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  await db.collection("users").doc(uid).update({
    walletLocked: true
  });

  alert("✅ Withdrawal request sent\nAdmin ko email chala gaya");
}

/* ===============================
   PROFILE SAVE
================================ */
async function saveProfile() {
  const email = document.getElementById("profileEmail").value;
  const phone = document.getElementById("profilePhone").value;

  await db.collection("users").doc(currentUser.uid).update({
    email,
    phone
  });

  alert("✅ Profile saved");
}

/* ===============================
   EXPOSE TO HTML
================================ */
window.showPage = showPage;
window.openOffer = openOffer;
window.requestWithdraw = requestWithdraw;
window.saveProfile = saveProfile;