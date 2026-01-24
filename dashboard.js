import { auth, db } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection, serverTimestamp, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const balanceEl = document.getElementById('balance-val');
const emailEl = document.getElementById('user-email');

// 1. Monitor Auth State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        emailEl.innerText = user.email;
        await ensureUserDocumentExists(user);
        startBalanceListener(user.uid);
    } else {
        window.location.href = 'index.html';
    }
});

// 2. SAFETY: Create document if it doesn't exist (Fixes Loading Error)
async function ensureUserDocumentExists(user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
        console.log("Creating missing user document...");
        await setDoc(userRef, {
            email: user.email,
            balance: 0,
            createdAt: serverTimestamp()
        });
    }
}

// 3. Real-time Balance Sync
function startBalanceListener(uid) {
    const userRef = doc(db, "users", uid);
    onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const currentBalance = data.balance || 0;
            balanceEl.innerText = `₹${currentBalance.toFixed(2)}`;
        } else {
            balanceEl.innerText = "₹0.00";
        }
    }, (error) => {
        console.error("Firestore Error:", error);
        balanceEl.innerText = "Error Loading";
    });
}

// 4. Task Logic (Remains same, but with error handling)
async function handleTask(btn) {
    const url = btn.dataset.url;
    const time = parseInt(btn.dataset.time);
    const rewardStr = btn.dataset.reward;
    const originalText = btn.innerText;

    window.open(url, '_blank');
    btn.disabled = true;
    
    let timeLeft = time;
    const countdown = setInterval(async () => {
        timeLeft--;
        btn.innerText = `Wait ${timeLeft}s...`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            btn.innerText = "Adding Reward...";
            
            let rewardAmount = rewardStr === "random" 
                ? Math.floor(Math.random() * (15 - 5 + 1)) + 5 
                : parseFloat(rewardStr);

            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    balance: increment(rewardAmount)
                });
                alert(`Success! ₹${rewardAmount} added.`);
            } catch (err) {
                alert("Database Error: Could not add balance.");
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    }, 1000);
}

// 5. Withdrawal Logic (Min ₹200)
document.getElementById('submit-withdraw').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('w-amount').value);
    const upi = document.getElementById('w-upi').value;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(userRef);
    const currentBalance = snap.data().balance;

    if (amount < 200) return alert("Minimum withdrawal is ₹200");
    if (amount > currentBalance) return alert("Insufficient balance!");
    if (!upi.includes('@')) return alert("Invalid UPI ID");

    try {
        await addDoc(collection(db, "withdrawals"), {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            amount: amount,
            upi: upi,
            status: "pending",
            createdAt: serverTimestamp()
        });
        alert("Withdrawal Requested! Amount will be deducted after admin approval.");
        document.getElementById('withdraw-modal').classList.remove('active');
    } catch (err) {
        alert("Error: " + err.message);
    }
});

// Initialize Task Buttons
document.querySelectorAll('.task-trigger').forEach(button => {
    button.addEventListener('click', () => handleTask(button));
});

// Logout logic
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});
