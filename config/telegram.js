Telegram.WebApp.ready()

const user = Telegram.WebApp.initDataUnsafe?.user
if(!user){
  alert("Open inside Telegram")
  throw "Telegram required"
}

APP_STATE.telegram_id = user.id
