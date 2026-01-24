<script type="module">
  // Firebase SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // ✅ Firebase Config (CORRECT)
  const firebaseConfig = {
    apiKey: "AIzaSyAZ1fygNBz7wBMbMta10my7gtXg2rtF_4Y",
    authDomain: "xdevilearningtelegram.firebaseapp.com",
    projectId: "xdevilearningtelegram",
    storageBucket: "xdevilearningtelegram.firebasestorage.app",
    messagingSenderId: "676347528676",
    appId: "1:676347528676:web:ef137be8c1efabbb6e73f1",
    measurementId: "G-B400D3264Y"
  };

  // ✅ Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // ✅ Anonymous Login (Telegram safe)
  signInAnonymously(auth)
    .then(() => {
      console.log("Firebase Anonymous Login Successful ✅");
    })
    .catch((error) => {
      console.error("Firebase Login Error ❌", error);
    });

</script>
