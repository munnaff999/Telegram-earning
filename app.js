auth.onAuthStateChanged(u=>{
  if(u && location.pathname.includes("dashboard")){
    userEmail.innerText=u.email;
    db.collection("users").doc(u.uid).onSnapshot(d=>{
      balance.innerText=d.data().balance;
    });
  }
});

function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value)
  .then(r=>{
    db.collection("users").doc(r.user.uid).set({
      email:r.user.email,
      balance:0,
      role:"user"
    });
    location.href="dashboard.html";
  }).catch(e=>alert(e.message));
}

function login(){
  auth.signInWithEmailAndPassword(email.value,password.value)
  .then(()=>location.href="dashboard.html")
  .catch(e=>alert(e.message));
}

function offer(amt,url){
  window.open(url,"_blank");
  setTimeout(()=>{
    db.collection("users").doc(auth.currentUser.uid)
    .update({balance:firebase.firestore.FieldValue.increment(amt)});
  },30000);
}

function withdraw(){
  const amt=+withdrawAmt.value;
  if(amt<200) return alert("Minimum ₹200");
  db.collection("withdrawals").add({
    uid:auth.currentUser.uid,
    amount:amt,
    status:"pending"
  });
}

function logout(){auth.signOut().then(()=>location.href="index.html")}
