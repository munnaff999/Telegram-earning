function initHome(){
  document.getElementById("balance").innerText =
    APP_STATE.balance.toFixed(2)
}

function addBalance(amount){
  APP_STATE.balance += amount
  APP_STATE.history.push({
    type: "earn",
    amount,
    time: new Date().toLocaleString()
  })
}
