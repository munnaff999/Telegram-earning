let selectedAvatar = "../images/avatar1.png";

function selectAvatar(src) {
  selectedAvatar = src;
  document.getElementById("avatarPreview").src = src;
}

async function saveProfile() {
  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const referral = document.getElementById("referral").value.trim();

  if (!name || !username || !bio) {
    alert("Please fill all required fields");
    return;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("User not logged in");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        name,
        username,
        bio,
        avatar: selectedAvatar,
        referral_code: referral || null,
        balance: 0,
      },
    ]);

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "home.html";
  }
}
