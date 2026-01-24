import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZ1fygNBz7wBMbMta10my7gtXg2rtF_4Y",
  authDomain: "xdevilearningtelegram.firebaseapp.com",
  projectId: "xdevilearningtelegram",
  storageBucket: "xdevilearningtelegram.appspot.com",
  messagingSenderId: "676347528676",
  appId: "1:676347528676:web:ef137be8c1efabbb6e73f1",
  measurementId: "G-B400D3264Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
