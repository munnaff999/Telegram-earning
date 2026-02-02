/* ================================
   SUPABASE CORE CONFIG
   FILE: js/supabase.js
   ================================ */

// ⚠️ DEV / PROD SWITCH (future use)
const ENV = "PROD"; // DEV | PROD

// ❗ NEVER expose service_role key in frontend
const SUPABASE_CONFIG = {
  DEV: {
    url: "https://YOUR_DEV_PROJECT.supabase.co",
    anon: "DEV_ANON_KEY"
  },
  PROD: {
    url: "https://sqgmfbjllqdbzyfozufy.supabase.co",
    anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ21mYmpsbHFkYnp5Zm96dWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzc4MDgsImV4cCI6MjA4NDcxMzgwOH0.mLzb9BozHyXEG5un9zEfIHIOUhDf0x9iJq6xVh1lIQY"
  }
};

const SUPABASE_URL = SUPABASE_CONFIG[ENV].url;
const SUPABASE_ANON_KEY = SUPABASE_CONFIG[ENV].anon;

// Supabase Client
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,   // Remember Me (REAL)
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/* ================================
   SESSION HANDLING
   ================================ */

// Get current session
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return data?.session || null;
}

// Protect pages (call on app pages)
async function protectPage() {
  const session = await getSession();
  if (!session) {
    alert("Session expired. Please login again.");
    window.location.href = "/auth/login.html";
  }
}

/* ================================
   AUTH FUNCTIONS
   ================================ */

// LOGIN
async function loginUser(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

// SIGNUP (email verification ON)
async function signupUser(email, password, name, referral = null) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: "user",
        referral: referral
      }
    }
  });
}

// LOGOUT
async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "/auth/login.html";
}

/* ================================
   PROFILE MANAGEMENT
   ================================ */

// Create profile on FIRST LOGIN
async function ensureProfile(user) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      id: user.id,
      balance: 0,
      role: "user",
      language: localStorage.getItem("lang") || "en"
    });
  }
}

// Get profile
async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return data;
}

/* ================================
   ROLE CHECK
   ================================ */

async function isAdmin() {
  const profile = await getProfile();
  return profile?.role === "admin";
}

/* ================================
   LANGUAGE SYNC
   ================================ */

async function setLanguage(lang) {
  localStorage.setItem("lang", lang);

  const session = await getSession();
  if (session) {
    await supabase
      .from("profiles")
      .update({ language: lang })
      .eq("id", session.user.id);
  }
}

function getLanguage() {
  return localStorage.getItem("lang") || "en";
}

/* ================================
   AUTH STATE LISTENER
   ================================ */

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    await ensureProfile(session.user);
  }
});

/* ================================
   EDGE FUNCTION HELPER (POSTBACK)
   ================================ */

// future use
async function callEdgeFunction(name, payload) {
  return await supabase.functions.invoke(name, {
    body: payload
  });
}

/* ================================
   EXPORT (OPTIONAL)
   ================================ */
// window.supabaseClient = supabase;
