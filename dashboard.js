import { auth, db } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let currentUser = null;
const uid = localStorage.getItem('xdevil_uid');

// 1. Auth Guard
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('user-email').innerText = user.email;
        loadUserData(user.uid);
    } else {
        window.location.href = 'index.html';
    }
});

// 2. Real-time Balance Update
function loadUserData(uid) {
    onSnapshot(doc(db, "users", uid), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('balance-val').innerText = `₹${data.balance.toFixed(2)}`;
        }
    });
}

// 3. Task Handler Logic
async function handleTask(btn) {
    const url = btn.dataset.url;
    const time = parseInt(btn.dataset.time);
    const rewardType = btn.dataset.reward;
    const originalText = btn.innerText;

    // Open Ad in new tab
    window.open(url, '_blank');

    // Start Timer
    btn.disabled = true;
    let timeLeft = time;

    const countdown = setInterval(() => {
        timeLeft--;
        btn.innerText = `Wait ${timeLeft}s...`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            processReward(rewardType, btn, originalText);
        }
    }, 1000);
}

async function processReward(type, btn, originalText) {
    let amount = 0;
    
    if (type === "random") {
        amount = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // ₹5 to ₹15
    } else {
        amount = parseFloat(type);
    }

    try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            balance: increment(amount)
        });
        alert(`Congratulations! ₹${amount} added to your balance.`);
    } catch (err) {
        alert("Error adding balance. Try again.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

// 4. Withdrawal System
const modal = document.getElementById('withdraw-modal');
document.getElementById('open-withdraw').addEventListener('click', () => modal.classList.add('active'));
document.getElementById('close-modal').addEventListener('click', () => modal.classList.remove('active'));

document.getElementById('submit-withdraw').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('w-amount').value);
    const upi = document.getElementById('w-upi').value;

    if (amount < 200) return alert("Minimum withdrawal is ₹200");
    if (!upi.includes('@')) return alert("Enter a valid UPI ID");

    try {
        await addDoc(collection(db, "withdrawals"), {
            uid: currentUser.uid,
            email: currentUser.email,
            amount: amount,
            upi: upi,
            status: "pending",
            createdAt: serverTimestamp()
        });
        alert("Request submitted successfully! Admin will approve within 24 hours.");
        modal.classList.remove('active');
    } catch (err) {
        alert("Error submitting request.");
    }
});

// 5. Event Listeners for Tasks
document.querySelectorAll('.task-trigger').forEach(button => {
    button.addEventListener('click', () => handleTask(button));
});

// 6. Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});
