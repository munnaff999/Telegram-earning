const ADMIN_EMAIL="youradmin@gmail.com";

auth.onAuthStateChanged(u=>{
  if(!u||u.email!==ADMIN_EMAIL){location.href="index.html";return;}
  db.collection("users").onSnapshot(s=>{
    users.innerHTML="<tr><th>Email</th><th>Balance</th></tr>";
    s.forEach(d=>{
      users.innerHTML+=`<tr><td>${d.data().email}</td><td>₹${d.data().balance}</td></tr>`;
    });
  });
  db.collection("withdrawals").where("status","==","pending")
  .onSnapshot(s=>{
    withdraws.innerHTML="<tr><th>User</th><th>Amt</th><th>Action</th></tr>";
    s.forEach(d=>{
      withdraws.innerHTML+=`
      <tr>
        <td>${d.data().uid}</td>
        <td>₹${d.data().amount}</td>
        <td>
          <button class="btn" onclick="approve('${d.id}','${d.data().uid}',${d.data().amount})">Approve</button>
        </td>
      </tr>`;
    });
  });
});

function approve(id,uid,amt){
  db.collection("users").doc(uid)
  .update({balance:firebase.firestore.FieldValue.increment(-amt)});
  db.collection("withdrawals").doc(id).update({status:"approved"});
}
