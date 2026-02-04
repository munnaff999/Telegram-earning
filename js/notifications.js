let uid = null;

document.addEventListener("DOMContentLoaded", initNotify);

async function initNotify() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return location.href = "../auth/login.html";
  uid = user.id;
  loadNotifications();
  setInterval(loadNotifications, 30000);
}

async function loadNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });

  const list = document.getElementById("notifyList");
  list.innerHTML = "";

  if (error || !data.length) {
    list.innerHTML = `<p class="empty">No notifications yet</p>`;
    return;
  }

  data.forEach(n => {
    list.innerHTML += `
      <div class="notify-item ${n.read ? "" : "unread"}"
           onclick="markRead('${n.id}')">
        <span class="icon">🔔</span>
        <span>${n.message}</span>
      </div>
    `;
  });
}

async function markRead(id) {
  await supabase.from("notifications")
    .update({ read: true })
    .eq("id", id);

  loadNotifications();
}

async function clearAll() {
  if (!confirm("Clear all notifications?")) return;
  await supabase.from("notifications")
    .delete()
    .eq("user_id", uid);
  loadNotifications();
}

