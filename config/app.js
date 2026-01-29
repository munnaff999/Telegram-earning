function loadPage(page){
  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html

      if(page === "home") initHome()
      if(page === "earning") initEarning()
      if(page === "profile") initProfile()
      if(page === "withdraw") initWithdraw()
      if(page === "history") initHistory()
    })
}
