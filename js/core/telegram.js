export function initTelegram() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    console.log("Telegram user:", Telegram.WebApp.initDataUnsafe.user);
  }
}
