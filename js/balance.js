<script>
async function loadBalance() {
  try {
    const telegram_id = localStorage.getItem("telegram_id");

    if (!telegram_id) {
      document.getElementById("balance").innerText = "0";
      console.warn("Telegram ID not found");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("telegram_id", telegram_id)
      .maybeSingle();

    if (error) {
      console.error("Balance fetch error:", error.message);
      document.getElementById("balance").innerText = "0";
      return;
    }

    // User not found → auto create
    if (!data) {
      await supabase.from("users").insert({
        telegram_id: telegram_id,
        balance: 0
      });

      document.getElementById("balance").innerText = "0";
      return;
    }

    document.getElementById("balance").innerText = data.balance ?? 0;

  } catch (err) {
    console.error("Unexpected error:", err);
    document.getElementById("balance").innerText = "0";
  }
}

document.addEventListener("DOMContentLoaded", loadBalance);
</script>
