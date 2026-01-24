import { db } from "./config.js";
import {
 doc,getDoc,updateDoc,addDoc,collection
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");
const balEl = document.getElementById("bal");

async function load(){
 const s = await getDoc(doc(db,"users",uid));
 balEl.innerText = s.data().balance;
}
load();

window.task = async (url, reward, sec)=>{
 window.open(url,"_blank");
 alert("Complete task. Reward after time.");

 setTimeout(async ()=>{
   const ref=doc(db,"users",uid);
   const s=await getDoc(ref);
   await updateDoc(ref,{
     balance: s.data().balance + reward
   });
   load();
 },sec*1000);
};

window.withdraw = async ()=>{
 const amt=Number(document.getElementById("amt").value);
 if(amt<200){ msg.innerText="Min ₹200"; return; }

 await addDoc(collection(db,"withdrawals"),{
  uid, amt, upi:upi.value, time:Date.now()
 });

 msg.innerText="Withdraw request sent";
};
