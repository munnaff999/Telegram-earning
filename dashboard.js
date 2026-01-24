import { auth, db } from './config.js';
import { doc, onSnapshot, updateDoc, increment, collection, addDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

let currentUser = null;
let isTaskRunning = false;

// Initialize Dashboard
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        setupListeners(user.uid);
        loadHistory(user.uid);
    } else {
        window.location.href = 'index.html';
    }
});

function setupListeners(uid) {
    onSnapshot(doc(db, "users", uid), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('stat-balance').innerText = `₹${data.balance.toFixed(2)}`;
            document.getElementById('stat-today').innerText = `₹${data.todayEarning.toFixed(2)}`;
            document.getElementById('stat-total').innerText = `₹${data.totalEarning.toFixed(2)}`;
            document.getElementById('stat-tasks').innerText = data.completedTasks;
            document.getElementById('user-email-nav').innerText = data.email;
            document.getElementById('loader').classList.add('hidden');
        }
    });
}

// Earning Logic
const taskButtons = document.querySelectorAll('.task-btn');
taskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(isTaskRunning) return showToast("Complete current task first!");
        
        const url = btn.dataset.url;
        const reward = parseFloat(btn.dataset.reward);
        const type = btn.dataset.type;

        // Open Ad
        window.open(url, '_blank');
        startCooldown(btn, reward, type);
    });
});

function startCooldown(btn, reward, type) {
    isTaskRunning = true;
    let timeLeft = 30;
    const originalText = btn.innerText;
    
    // Disable all task buttons
    taskButtons.forEach(b => b.disabled = true);

    const timer = setInterval(() => {
        btn.innerText = `Wait ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            addReward(reward);
            btn.innerText = originalText;
            taskButtons.forEach(b => b.disabled = false);
            isTaskRunning = false;
            showToast(`Success! ₹${reward} added.`);
        }
    }, 1000);
}

async function addReward(amt) {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        balance: increment(amt),
        todayEarning: increment(amt),
        totalEarning: increment(amt),
        completedTasks: increment(1),
        lastTaskTime: new Date().getTime()
    });
}

// Withdraw Logic
document.getElementById('btn-withdraw').addEventListener('click', async () => {
    const upi = document.getElementById('upi-id').value;
    const amt = parseFloat(document.getElementById('withdraw-amount').value);
    
    if(!upi || amt < 200) return showToast("Min ₹200 and valid UPI required");

    // Check balance
    const userSnap = await doc(db, "users", currentUser.uid);
    // In a real app, verify balance on server. Here we just submit request.
    
    await addDoc(collection(db, "withdrawals"), {
        uid: currentUser.uid,
        email: currentUser.email,
        amount: amt,
        upi: upi,
        type: 'Withdrawal',
        status: 'pending',
        createdAt: new Date().getTime()
    });
    showToast("Request Submitted!");
});

// Redeem Logic
document.getElementById('btn-redeem').addEventListener('click', async () => {
    const amt = parseFloat(document.getElementById('redeem-amount').value);
    if(amt < 200) return showToast("Min ₹200 required");

    await addDoc(collection(db, "withdrawals"), {
        uid: currentUser.uid,
        email: currentUser.email,
        amount: amt,
        upi: 'Google Play Redeem',
        type: 'Redeem',
        status: 'pending',
        createdAt: new Date().getTime()
    });
    showToast("Redeem request sent!");
});

function loadHistory(uid) {
    const q = query(collection(db, "withdrawals"), where("uid", "==", uid), orderBy("createdAt", "desc"), limit(10));
    onSnapshot(q, (snapshot) => {
        const tbody = document.getElementById('history-body');
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const item = doc.data();
            tbody.innerHTML += `
                <tr>
                    <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>₹${item.amount}</td>
                    <td>${item.type}</td>
                    <td class="status-${item.status}">${item.status}</td>
                </tr>
            `;
        });
    });
}

document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));