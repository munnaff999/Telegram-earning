import { auth, db } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js"; // Note: Use the imports from config if already exported
import { doc, onSnapshot, updateDoc, increment, addDoc, collection, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// --- 1. DOM ELEMENTS ---
const balanceEl = document.getElementById('balance-val');
const emailEl = document.getElementById('user-email');
const modal = document.getElementById('withdraw-modal');
const openWithdrawBtn = document.getElementById('open-withdraw');
const closeWithdrawBtn = document.getElementById('close-modal');
const submitWithdrawBtn = document.getElementById('submit-withdraw');

// --- 2. AUTH & BALANCE SYNC ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        emailEl.innerText = user.email;
        // Real-time balance update
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                balanceEl.innerText = `₹${docSnap.data().balance.toFixed(2)}`;
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

// --- 3. MODAL LOGIC (REDEEM BUTTON FIX) ---
if (openWithdrawBtn) {
    openWithdrawBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

if (closeWithdrawBtn) {
    closeWithdrawBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// Modal ke bahar click karne par band karein
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// --- 4. WITHDRAWAL SUBMISSION ---
if (submitWithdrawBtn) {
    submitWithdrawBtn.addEventListener('click', async () => {
        const amount = parseFloat(document.getElementById('w-amount').value);
        const upi = document.getElementById('w-upi').value;

        if (!amount || amount < 200) {
            alert("Minimum withdrawal ₹200 hai!");
            return;
        }
        if (!upi || !upi.includes('@')) {
            alert("Sahi UPI ID dalein!");
            return;
        }

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            const currentBalance = userSnap.data().balance;

            if (currentBalance < amount) {
                alert("Aapka balance kam hai!");
                return;
            }

            // Request save karein
            await addDoc(collection(db, "withdrawals"), {
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                amount: amount,
                upi: upi,
                status: "pending",
                createdAt: serverTimestamp()
            });

            // Balance deduct karein
            await updateDoc(userRef, {
                balance: increment(-amount)
            });

            alert("Request submitted! Paisa 24h mein mil jayega.");
            modal.classList.remove('active');
        } catch (err) {
            alert("Error: " + err.message);
        }
    });
}

// --- 5. TASK SYSTEM (TIMER LOGIC) ---
async function startTask(btn) {
    const url = btn.dataset.url;
    const time = parseInt(btn.dataset.time);
    const rewardType = btn.dataset.reward;
    const originalText = btn.innerText;

    window.open(url, '_blank');
    btn.disabled = true;

    let timeLeft = time;
    const timer = setInterval(async () => {
        timeLeft--;
        btn.innerText = `Wait ${timeLeft}s...`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.innerText = "Adding Reward...";

            let reward = rewardType === "random" 
                ? Math.floor(Math.random() * (15 - 5 + 1)) + 5 
                : parseFloat(rewardType);

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                balance: increment(reward)
            });

            alert(`₹${reward} added!`);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }, 1000);
}

// Task buttons attach karein
document.querySelectorAll('.task-trigger').forEach(btn => {
    btn.addEventListener('click', () => startTask(btn));
});

// --- 6. LOGOUT ---
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    });
});
