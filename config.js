// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAZ1fygNBz7wBMbMta10my7gtXg2rtF_4Y",
  authDomain: "xdevilearningtelegram.firebaseapp.com",
  projectId: "xdevilearningtelegram",
  appId: "1:676347528676:web:ef137be8c1efabbb6e73f1"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
