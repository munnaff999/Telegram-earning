auth.onAuthStateChanged(user => {
  if (!user || user.email !== xdevilearning@gmail.com) {
    alert("Access denied");
    location.href = "index.html";
    return;
  }

  loadUsers();
  loadWithdrawals();
});

// ================= USERS =================
function loadUsers() {
  db.collection("users").onSnapshot(snap => {
    let html = "";
    document.getElementById("totalUsers").innerText = snap.size;

    snap.forEach(doc => {
      const d = doc.data();
      html += `
        <tr>
          <td>${d.email}</td>
          <td>₹${d.balance}</td>
          <td>₹${d.totalEarned}</td>
          <td>
            <input type="number" id="add_${doc.id}">
            <button onclick="addBalance('${doc.id}')">Add</button>
          </td>
        </tr>
      `;
    });

    document.getElementById("usersTable").innerHTML = html;
  });
}

function addBalance(uid) {
  const amt = Number(document.getElementById("add_" + uid).value);
  if (amt <= 0) return;

  db.collection("users").doc(uid).update({
    balance: firebase.firestore.FieldValue.increment(amt),
    totalEarned: firebase.firestore.FieldValue.increment(amt)
  });
}

// ================= WITHDRAWALS =================
function loadWithdrawals() {
  db.collection("withdrawals").where("status", "==", "pending")
    .onSnapshot(snap => {
      let html = "";
      document.getElementById("pendingWithdraws").innerText = snap.size;

      snap.forEach(doc => {
        const d = doc.data();
        html += `
          <tr>
            <td>${d.uid}</td>
            <td>₹${d.amount}</td>
            <td>${d.status}</td>
            <td>
              <button onclick="approve('${doc.id}','${d.uid}',${d.amount})">Approve</button>
              <button onclick="reject('${doc.id}')">Reject</button>
            </td>
          </tr>
        `;
      });

      document.getElementById("withdrawTable").innerHTML = html;
    });
}

function approve(id, uid, amt) {
  const uRef = db.collection("users").doc(uid);
  const wRef = db.collection("withdrawals").doc(id);

  db.runTransaction(async t => {
    const u = await t.get(uRef);
    if (!u.exists || u.data().balance < amt) return;

    t.update(uRef, { balance: u.data().balance - amt });
    t.update(wRef, { status: "approved" });
  });
}

function reject(id) {
  db.collection("withdrawals").doc(id).update({ status: "rejected" });
}

function logout() {
  auth.signOut();
}
