import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZ1fygNBz7wBMbMta10my7gtXg2rtF_4Y",
    authDomain: "xdevilearningtelegram.firebaseapp.com",
    projectId: "xdevilearningtelegram",
    storageBucket: "xdevilearningtelegram.firebasestorage.app",
    messagingSenderId: "676347528676"
    appId: "YOUR_APP_ID: "1:676347528676:web:ef137be8c1efabbb6e73f1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
