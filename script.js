let balance = 0;
let completed = 0;

function addMoney(amount) {
  balance += amount;
  completed += 1;
  document.getElementById("balance").innerText = balance;
  document.getElementById("completed").innerText = completed;
}

function installTask() {
  window.open("https://xml.qualiclicks.com/redirect?feed=1054597&auth=jJeR", "_blank");
  showStatus("⏳ Install offer started... wait 30 sec");

  setTimeout(() => {
    addMoney(10);
    showStatus("✅ ₹10 added");
  }, 30000);
}

function surveyTask() {
  window.open("https://playabledownloads.com/1869976/XDEVILEARNING", "_blank");
  showStatus("⏳ Survey started...");

  setTimeout(() => {
    addMoney(7);
    showStatus("✅ Survey completed");
  }, 20000);
}

function kycTask() {
  window.open("https://otieu.com/4/10508140", "_blank");
  showStatus("⏳ KYC task started...");

  setTimeout(() => {
    addMoney(20);
    showStatus("✅ ₹20 added");
  }, 40000);
}

function redeem() {
  if (balance >= 200) {
    alert("🎉 Redeem successful!");
    balance = 0;
    document.getElementById("balance").innerText = balance;
  } else {
    alert("❌ Minimum ₹200 required");
  }
}

function showStatus(msg) {
  document.getElementById("status").innerText = msg;
}
