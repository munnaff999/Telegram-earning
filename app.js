auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("userEmail").innerText = user.email;
    loadUser(user.uid);
  }
});

function signup() {
  const e = email.value.trim();
  const p = password.value.trim();
  auth.createUserWithEmailAndPassword(e,p).then(res=>{
    return db.collection("users").doc(res.user.uid).set({
      email:e,balance:0,totalEarned:0
    });
  }).catch(err=>alert(err.message));
}

function login() {
  auth.signInWithEmailAndPassword(
    email.value.trim(),
    password.value.trim()
  ).catch(err=>alert(err.message));
}

function loadUser(uid){
  db.collection("users").doc(uid).onSnapshot(d=>{
    balance.innerText="₹"+d.data().balance;
    totalEarned.innerText="₹"+d.data().totalEarned;
  });
}

function logout(){ auth.signOut(); }

function startOffer(amount,url){
  window.open(url,"_blank");
  status.innerText="⏳ Please wait 30 seconds...";
  setTimeout(()=>{
    const u=auth.currentUser.uid;
    db.collection("users").doc(u).update({
      balance:firebase.firestore.FieldValue.increment(amount),
      totalEarned:firebase.firestore.FieldValue.increment(amount)
    });
    status.innerText="✅ ₹"+amount+" added!";
  },30000);
}

function requestWithdraw(){
  const amt=+withdrawAmount.value;
  if(amt<200){alert("Minimum ₹200");return;}
  db.collection("withdrawals").add({
    uid:auth.currentUser.uid,
    amount:amt,
    status:"pending"
  });
  alert("Withdraw request sent");
}
