
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration
 * Updated with the valid credentials provided for the 'xdevilearningtelegram' project.
 * These settings ensure proper authentication and database access.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAZ1fygNBz7wBMbMta10my7gtXg2rtF_4Y",
  authDomain: "xdevilearningtelegram.firebaseapp.com",
  projectId: "xdevilearningtelegram",
  storageBucket: "xdevilearningtelegram.firebasestorage.app",
  messagingSenderId: "676347528676",
  appId: "1:676347528676:web:ef137be8c1efabbb6e73f1",
  measurementId: "G-B400D3264Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
