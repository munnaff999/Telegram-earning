let coins = localStorage.getItem("coins")
  ? parseFloat(localStorage.getItem("coins"))
  : 0;

updateCoin();

function updateCoin() {
  document.getElementById("coin").innerText = coins.toFixed(2);
  document.getElementById("coin2").innerText = coins.toFixed(2);
  localStorage.setItem("coins", coins);
}

function openTab(tab) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
  document.getElementById("pageTitle").innerText =
    tab.charAt(0).toUpperCase() + tab.slice(1);
}

function showAd() {
  // 👉 YAHAN MONETAG AD CALL AAYEGA

  // demo reward
  setTimeout(() => {
    coins += 0.10;
    updateCoin();
    alert("You earned 0.10 coin 🎉");
  }, 1000);
}
