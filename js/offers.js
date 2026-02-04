document.addEventListener("DOMContentLoaded", loadOffers);

async function loadOffers() {
  const container = document.getElementById("offers");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .order("id");

  container.classList.remove("skeleton");

  if (error || !offers.length) {
    container.innerHTML = "<p>No offers available</p>";
    return;
  }

  container.innerHTML = "";

  offers.forEach(o => {
    container.innerHTML += `
      <div class="offer-card ${o.status}">
        <div>
          <h4>${o.app_name}</h4>
          <p>${o.description}</p>
          <small>Status: ${o.status}</small>
        </div>
        <button 
          ${o.status !== "unlocked" ? "disabled" : ""}
          onclick="startOffer('${o.id}')">
          ₹${o.reward}
        </button>
      </div>
    `;
  });
}

function startOffer(id) {
  alert("Redirect to Play Store / App link\n(Real verification can be added)");
}
