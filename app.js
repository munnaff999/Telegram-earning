/***********************
  FIREBASE REFERENCES
************************/
const auth = firebase.auth();
const db = firebase.firestore();

/***********************
  GLOBAL STATE
************************/
let currentUser = null;
let cooldown = false;

/***********************
  AUTH – SIGNUP
************************/
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      currentUser = res.user;
      return db.collection("users").doc(currentUser.uid).set({
        email: email,
        balance: 0,
        totalEarned: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Signup successful");
      showDashboard();
    })
    .catch(err => alert(err.message));
}

/***********************
  AUTH – LOGIN
************************/
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(res => {
      currentUser = res.user;
      showDashboard();
    })
    .catch(err => alert(err.message));
}

/***********************
  AUTH STATE
************************/
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    showDashboard();
  }
});

/***********************
  SHOW DASHBOARD
************************/
function showDashboard() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadProfile();
}

/***********************
  LOAD PROFILE
************************/
function loadProfile() {
  db.collection("users").doc(currentUser.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("balance").innerText = "₹" + data.balance;
        document.getElementById("totalEarned").innerText = "₹" + data.totalEarned;
        document.getElementById("userEmail").innerText = data.email;
      }
    });
}

/***********************
  OPEN AD / OFFER
************************/
function startOffer(amount, url) {
  if (cooldown) {
    alert("⏳ Please wait before next task");
    return;
  }

  cooldown = true;
  window.open(url, "_blank");

  document.getElementById("status").innerText =
    "⏳ Offer started... please wait 30 seconds";

  setTimeout(() => {
    rewardUser(amount);
    cooldown = false;
  }, 30000); // 30 seconds gap
}

/***********************
  REWARD USER
************************/
function rewardUser(amount) {
  const userRef = db.collection("users").doc(currentUser.uid);

  db.runTransaction(transaction => {
    return transaction.get(userRef).then(doc => {
      const newBalance = (doc.data().balance || 0) + amount;
      const totalEarned = (doc.data().totalEarned || 0) + amount;

      transaction.update(userRef, {
        balance: newBalance,
        totalEarned: totalEarned
      });
    });
  });

  document.getElementById("status").innerText =
    `✅ Task completed! ₹${amount} added`;
}

/***********************
  WITHDRAW REQUEST
************************/
function requestWithdraw() {
  const amount = parseInt(document.getElementById("withdrawAmount").value);

  if (amount < 200) {
    alert("❌ Minimum withdraw ₹200");
    return;
  }

  const userRef = db.collection("users").doc(currentUser.uid);

  userRef.get().then(doc => {
    if (doc.data().balance < amount) {
      alert("❌ Insufficient balance");
      return;
    }

    db.collection("withdrawals").add({
      userId: currentUser.uid,
      amount: amount,
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    userRef.update({
      balance: doc.data().balance - amount
    });

    alert("✅ Withdraw request submitted");
  });
}

/***********************
  LOGOUT
************************/
function logout() {
  auth.signOut();
  location.reload();
}
