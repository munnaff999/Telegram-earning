// auth.js
// Updated, production-ready auth + small helpers for XDEVIL EARNING
// Uses Firebase v9 modular CDN (9.15.0)

import { auth, db } from './config.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/* -------------------------
   Small UI helper: toast
   ------------------------- */
window.showToast = (msg) => {
  const container = document.getElementById("toast-container");
  if (!container) return alert(msg);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  container.appendChild(toast);

  setTimeout(() => {
    try { toast.remove(); } catch(e) {}
  }, 3000);
};

/* -------------------------
   Safe DOM getters
   ------------------------- */
const $ = id => document.getElementById(id);

/* Form / button elements (may be absent depending on page) */
const loginForm = $('login-form');        // optional form wrapper
const signupForm = $('signup-form');      // optional form wrapper
const btnSignup = $('btn-signup');
const btnLogin = $('btn-login');
const btnLogout = $('btn-logout');
const btnForgot = $('btn-forgot');

/* Input fields (IDs expected in HTML) */
const inputSignupEmail = $('signup-email');
const inputSignupPassword = $('signup-password');

const inputLoginEmail = $('login-email');
const inputLoginPassword = $('login-password');

const inputForgotEmail = $('forgot-email');

/* -------------------------
   Helper functions
   ------------------------- */
const guardExists = (el, name) => {
  if (!el) {
    // console.warn(`${name} not present on this page.`);
    return false;
  }
  return true;
};

/* -------------------------
   SIGNUP
   ------------------------- */
if (btnSignup) {
  btnSignup.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!guardExists(inputSignupEmail, 'signup-email') ||
        !guardExists(inputSignupPassword, 'signup-password')) {
      showToast("Signup form incomplete.");
      return;
    }

    const email = inputSignupEmail.value.trim();
    const pass = inputSignupPassword.value;

    if (!email || !pass) {
      showToast("Please enter email and password.");
      return;
    }
    if (pass.length < 6) {
      showToast("Password must be at least 6 characters.");
      return;
    }

    try {
      showToast("Creating account...");
      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      // Create user doc in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        email: email,
        balance: 0,
        todayEarning: 0,
        totalEarning: 0,
        completedTasks: 0,
        lastTaskTime: 0,
        createdAt: serverTimestamp(),
        isAdmin: false
      });

      // store uid & redirect
      localStorage.setItem("uid", cred.user.uid);
      window.location.href = "dashboard.html";
    } catch (err) {
      showToast(err.message || "Signup failed");
      console.error("Signup error:", err);
    }
  });
}

/* -------------------------
   LOGIN
   ------------------------- */
if (btnLogin) {
  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!guardExists(inputLoginEmail, 'login-email') ||
        !guardExists(inputLoginPassword, 'login-password')) {
      showToast("Login form incomplete.");
      return;
    }

    const email = inputLoginEmail.value.trim();
    const pass = inputLoginPassword.value;

    if (!email || !pass) {
      showToast("Please enter email and password.");
      return;
    }

    try {
      showToast("Logging in...");
      const res = await signInWithEmailAndPassword(auth, email, pass);

      localStorage.setItem("uid", res.user.uid);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      showToast("Invalid credentials");
    }
  });
}

/* -------------------------
   LOGOUT
   ------------------------- */
if (btnLogout) {
  btnLogout.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Logout failed:", err);
      showToast("Logout failed");
    }
  });
}

/* -------------------------
   FORGOT PASSWORD (optional)
   ------------------------- */
if (btnForgot) {
  btnForgot.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!guardExists(inputForgotEmail, 'forgot-email')) {
      showToast("Enter your email in the forgot field.");
      return;
    }
    const email = inputForgotEmail.value.trim();
    if (!email) {
      showToast("Please enter email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent.");
    } catch (err) {
      console.error("Forgot password error:", err);
      showToast("Error sending reset email");
    }
  });
}

/* -------------------------
   AUTH STATE & GUARD
   - Handles redirects for GitHub Pages and normal hosting
   - If user logged in: redirect away from index -> dashboard
   - If no user: block dashboard/admin and go to index
   ------------------------- */
onAuthStateChanged(auth, async (user) => {
  try {
    const path = window.location.pathname || "";

    // Useful paths:
    const onIndexLikePage = path.includes("index.html") || path.endsWith("/") || path === "";
    const onDashboardPage = path.includes("dashboard.html");
    const onAdminPage = path.includes("admin.html");

    if (user) {
      // Ensure uid stored
      localStorage.setItem("uid", user.uid);

      // If on index-like page, go to dashboard
      if (onIndexLikePage) {
        window.location.href = "dashboard.html";
        return;
      }

      // If on admin page, we will allow but admin page should have its own check to read isAdmin
      // nothing else to do here
    } else {
      // not logged in => if on protected pages, redirect to index
      if (onDashboardPage || onAdminPage) {
        localStorage.removeItem("uid");
        window.location.href = "index.html";
        return;
      }
      // otherwise do nothing on public pages
    }
  } catch (err) {
    console.error("AuthState error:", err);
  }
});

/* -------------------------
   Helper: sync user doc with localStorage (optional)
   Call this from other scripts if needed
   ------------------------- */
window.refreshUserLocal = async () => {
  try {
    const uid = localStorage.getItem("uid");
    if (!uid) return null;
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    // store minimal fields locally if needed
    localStorage.setItem("balance", String(data.balance || 0));
    localStorage.setItem("email", data.email || "");
    return data;
  } catch (err) {
    console.error("refreshUserLocal error:", err);
    return null;
  }
};
