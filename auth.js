import { auth, db } from './config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
window.showToast = (msg) => {
  const container = document.getElementById("toast-container");
  if (!container) return alert(msg);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
};
// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

// Toggle UI
if(showSignup) showSignup.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

if(showLogin) showLogin.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Signup
const btnSignup = document.getElementById('btn-signup');
if(btnSignup) btnSignup.addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;

    if(pass.length < 6) return showToast("Password too short!");

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", cred.user.uid), {
            email: email,
            balance: 0,
            todayEarning: 0,
            totalEarning: 0,
            completedTasks: 0,
            lastTaskTime: 0,
            createdAt: new Date().getTime(),
            isAdmin: false
        });
        window.location.href = "dashboard.html";
    } catch (err) {
        showToast(err.message);
    }
});

// Login
const btnLogin = document.getElementById('btn-login');
if(btnLogin) btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "dashboard.html";
    } catch (err) {
        showToast("Invalid credentials");
    }
});

// Auth Guard & Logout
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    if (user) {
        if (path.includes('index.html') || path === '/') window.location.href = 'dashboard.html';
    } else {
        if (path.includes('dashboard.html') || path.includes('admin.html')) window.location.href = 'index.html';
    }
});
