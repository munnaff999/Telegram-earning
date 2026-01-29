function initWithdraw(){}

function submitWithdraw(){
  const amt = Number(amount.value)
  if(amt < APP_CONFIG.MIN_WITHDRAW){
    alert("Minimum withdrawal ₹399")
    return
  }

  const body = `
Telegram ID: ${APP_STATE.telegram_id}
Name: ${name.value}
UPI: ${upi.value}
Amount: ${amt}
  `

  window.location =
    `mailto:${APP_CONFIG.SUPPORT_EMAIL}?subject=Withdraw Request&body=${encodeURIComponent(body)}`
}
