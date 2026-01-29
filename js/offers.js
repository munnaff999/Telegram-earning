function initEarning(){}

function completeOffer(amount){
  addBalance(amount)
  alert("Offer completed! Balance updated")
}

const liveOffers = [
  "📲 Install & Open App",
  "🎮 Play Game & Earn",
  "💸 Finance App Offer Live",
  "🎁 Limited Time Reward"
];

let index = 0;
setInterval(() => {
  const el = document.getElementById("live-offer-text");
  if (el) {
    el.innerText = liveOffers[index % liveOffers.length];
    index++;
  }
}, 4000);
