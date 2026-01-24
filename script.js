let coins = 0;
let rupees = 0;

/* TAB SWITCH */
function openTab(id, el){
    document.querySelectorAll('.section').forEach(s=>{
        s.classList.remove('active');
    });
    document.querySelectorAll('nav div').forEach(n=>{
        n.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}

/* COIN TO RUPEE */
function convertCoin(){
    if(coins <= 0){
        alert("No coins available");
        return;
    }
    rupees += coins;
    coins = 0;
    updateWallet();
    alert("Coins converted to ₹ successfully");
}

/* WITHDRAW */
function withdraw(){
    if(rupees < 499){
        alert("Minimum withdrawal ₹499 required");
        return;
    }
    alert("Withdrawal request submitted (Demo)");
}

/* UPDATE UI */
function updateWallet(){
    document.getElementById("coin").innerText = coins;
    document.getElementById("rupees").innerText = rupees;
}

/* PAYMENT METHOD */
document.getElementById("method").addEventListener("change", function(){
    document.getElementById("bank").style.display =
        this.value === "bank" ? "block" : "none";
    document.getElementById("upi").style.display =
        this.value === "upi" ? "block" : "none";
});

/* DEMO AUTO COINS (REMOVE LATER) */
setInterval(()=>{
    coins += 1;   // demo earning
    updateWallet();
}, 8000);
